from django.db import models
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import NewsTopic, Subscriber
from .serializers import NewsTopicSerializer, SubscriberSerializer


import requests
import json
import math
import logging
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from .models import Resource
from geopy.distance import geodesic



from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import NewsItem, UserSession, NewsInteraction, UserBehavior
from .serializers import NewsItemSerializer, NewsInteractionSerializer, UserBehaviorSerializer
import json

@api_view(['POST'])
def track_user_behavior(request):
    data = request.data
    session_id = data.get('session_id')
    event_type = data.get('event_type')
    event_data = data.get('event_data', {})
    device_type = data.get('device_type', 'desktop')
    
    # Get or create session
    session, created = UserSession.objects.get_or_create(
        session_id=session_id,
        defaults={'device_type': device_type}
    )
    
    # Create behavior record
    behavior = UserBehavior.objects.create(
        session=session,
        event_type=event_type,
        event_data=event_data
    )
    
    # Handle specific events
    if event_type == 'news_view':
        news_id = event_data.get('news_id')
        if news_id:
            news_item = NewsItem.objects.filter(id=news_id).first()
            if news_item:
                interaction, _ = NewsInteraction.objects.get_or_create(
                    news_item=news_item,
                    session=session
                )
                interaction.viewed = True
                interaction.view_count += 1
                interaction.save()
    
    elif event_type in ['news_like', 'news_unlike']:
        news_id = event_data.get('news_id')
        if news_id:
            news_item = NewsItem.objects.filter(id=news_id).first()
            if news_item:
                interaction, _ = NewsInteraction.objects.get_or_create(
                    news_item=news_item,
                    session=session
                )
                interaction.liked = (event_type == 'news_like')
                interaction.save()
    
    return Response({'status': 'success'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def handle_like(request):
    data = request.data
    news_id = data.get('news_id')
    action = data.get('action')
    session_id = data.get('session_id')
    
    if not news_id or action not in ['like', 'unlike']:
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get or create session
    session, _ = UserSession.objects.get_or_create(
        session_id=session_id,
        defaults={'device_type': 'desktop'}
    )
    
    # Get news item
    news_item = NewsItem.objects.filter(id=news_id).first()
    if not news_item:
        return Response({'error': 'News item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Update interaction
    interaction, created = NewsInteraction.objects.get_or_create(
        news_item=news_item,
        session=session
    )
    interaction.liked = (action == 'like')
    interaction.save()
    
    return Response({'status': 'success'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_liked_news(request):
    session_id = request.query_params.get('session_id')
    if not session_id:
        return Response({'error': 'Session ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    session = UserSession.objects.filter(session_id=session_id).first()
    if not session:
        return Response({'liked_news': []}, status=status.HTTP_200_OK)
    
    liked_news = NewsInteraction.objects.filter(
        session=session,
        liked=True
    ).values_list('news_item_id', flat=True)
    
    return Response({'liked_news': list(liked_news)}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_news_stats(request):
    # Get view counts and like counts for all news items
    stats = {}
    
    # Get view counts
    view_counts = NewsInteraction.objects.values('news_item_id').annotate(
        views=models.Count('id', filter=models.Q(viewed=True))
    )
    
    # Get like counts
    like_counts = NewsInteraction.objects.values('news_item_id').annotate(
        likes=models.Count('id', filter=models.Q(liked=True))
    )
    
    # Combine stats
    for item in view_counts:
        stats[item['news_item_id']] = {'views': item['views']}
    
    for item in like_counts:
        if item['news_item_id'] in stats:
            stats[item['news_item_id']]['likes'] = item['likes']
        else:
            stats[item['news_item_id']] = {'likes': item['likes']}
    
    return Response(stats, status=status.HTTP_200_OK)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@csrf_exempt
def chat_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        # Validate request body
        if not request.body:
            logger.error("Empty request body received")
            return JsonResponse({'error': 'Request body is empty'}, status=400)

        try:
            data = json.loads(request.body)
            logger.debug(f"Received request data: {data}")
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        room = data.get('room')
        question = data.get('question')
        location = data.get('location')

        if not all([room, question]):
            logger.error(f"Missing fields: room={room}, question={question}")
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Initialize response variables
        ai_answer = ""
        resources = []

        # Handle location-specific queries
        if location and ('nearby' in question.lower() or 'closest' in question.lower() or 'shops' in question.lower() or 'market' in question.lower()):
            lat = location.get('lat')
            lon = location.get('lon')
            if not (isinstance(lat, (int, float)) and isinstance(lon, (int, float))):
                logger.error(f"Invalid location data: lat={lat}, lon={lon}")
                return JsonResponse({'error': 'Invalid or missing location coordinates'}, status=400)

            try:
                resources = get_nearby_resources(lat, lon, room)
            except Exception as e:
                logger.error(f"Error in get_nearby_resources: {str(e)}", exc_info=True)
                return JsonResponse({'error': 'Failed to fetch nearby resources'}, status=500)

            if resources:
                locations_list = "\n".join(
                    [f"{idx+1}. {r['name']} - {r['address']} ({r['distance_km']} km away)"
                     for idx, r in enumerate(resources[:3])]
                )
                ai_answer = f"Here are the closest {room} resources near you:\n{locations_list}"
            else:
                ai_answer = f"I couldn't find any {room} resources near your location. Please try a broader search or check your location settings."
        else:
            # For non-location questions, use the AI model
            full_prompt = f"You are a helpful assistant in the '{room}' Room, serving Kenyan users.\n\nUser question: {question}\n\nGive a clear, localized, and concise answer."

            # Check cache
            cache_key = f"ollama:{room}:{question}".replace(" ", "_").lower()
            cached_response = cache.get(cache_key)
            if cached_response:
                logger.debug(f"Cache hit for key: {cache_key}")
                ai_answer = cached_response
            else:
                # Retry Ollama request up to 2 times
                for attempt in range(1, 3):
                    try:
                        start_time = time.time()
                        ollama_response = requests.post(
                            "http://localhost:11434/api/generate",
                            json={
                                "model": "mistral",
                                "prompt": full_prompt,
                                "stream": False
                            },
                            timeout=60  # Increased timeout
                        )
                        ollama_response.raise_for_status()
                        ai_answer = ollama_response.json().get("response", "").strip()
                        logger.debug(f"Ollama request succeeded in {time.time() - start_time:.2f} seconds")
                        # Cache the response for 1 hour
                        cache.set(cache_key, ai_answer, 3600)
                        break
                    except requests.RequestException as e:
                        logger.error(f"Ollama request failed (attempt {attempt}/2): {str(e)}", exc_info=True)
                        if attempt == 2:
                            # Fallback response
                            ai_answer = "Sorry, I couldn't connect to the AI service. Please try again later or ask about nearby farming resources."
                            return JsonResponse({
                                "answer": ai_answer,
                                "resources": []
                            })

        return JsonResponse({
            "answer": ai_answer,
            "resources": resources
        })

    except Exception as e:
        logger.error(f"Unexpected error in chat_view: {str(e)}", exc_info=True)
        return JsonResponse({'error': str(e), 'message': 'Request processing failed'}, status=500)

def get_nearby_resources(lat, lon, category):
    max_distance_km = 20
    results = []

    # Try fetching from the Resource model
    if category.lower() == 'farming':
        try:
            for resource in Resource.objects.filter(category__iexact=category):
                try:
                    distance = geodesic((lat, lon), (resource.latitude, resource.longitude)).km
                    if distance <= max_distance_km:
                        results.append({
                            "name": resource.name,
                            "address": resource.address,
                            "phone": resource.phone if resource.phone else "N/A",
                            "latitude": resource.latitude,
                            "longitude": resource.longitude,
                            "distance_km": round(distance, 2)
                        })
                except Exception as e:
                    logger.error(f"Error processing resource {resource.name}: {str(e)}")
                    continue
        except Exception as e:
            logger.error(f"Database query failed: {str(e)}", exc_info=True)

    # If no results from the database, query Overpass API
    if not results and category.lower() == 'farming':
        overpass_query = f"""
        [out:json];
        (
          node["shop"="agrarian"](around:20000,{lat},{lon});
          node["amenity"="marketplace"](around:20000,{lat},{lon});
          way["shop"="agrarian"](around:20000,{lat},{lon});
          way["amenity"="marketplace"](around:20000,{lat},{lon});
        );
        out center;
        """

        try:
            response = requests.get(
                "https://overpass-api.de/api/interpreter",
                params={'data': overpass_query},
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            for element in data.get('elements', []):
                tags = element.get('tags', {})
                element_lat = element.get('lat', element.get('center', {}).get('lat'))
                element_lon = element.get('lon', element.get('center', {}).get('lon'))
                if not (element_lat and element_lon):
                    continue

                # Calculate distance using Haversine formula
                R = 6371
                φ1 = math.radians(lat)
                φ2 = math.radians(element_lat)
                Δφ = math.radians(element_lat - lat)
                Δλ = math.radians(element_lon - lon)
                a = math.sin(Δφ / 2)**2 + math.cos(φ1) * math.cos(φ2) * math.sin(Δλ / 2)**2
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                distance = R * c

                if distance <= max_distance_km:
                    results.append({
                        "name": tags.get('name', 'Agricultural Shop' if tags.get('shop') == 'agrarian' else 'Marketplace'),
                        "address": tags.get('addr:street', 'N/A'),
                        "phone": tags.get('phone', 'N/A'),
                        "latitude": element_lat,
                        "longitude": element_lon,
                        "distance_km": round(distance, 2)
                    })

        except requests.RequestException as e:
            logger.error(f"Overpass API request failed: {str(e)}", exc_info=True)
        except ValueError as e:
            logger.error(f"Overpass API response parsing failed: {str(e)}", exc_info=True)

    return sorted(results, key=lambda r: r['distance_km'])[:5]


class UpdateEmailView(APIView):
    permission_classes = [AllowAny]
    
    def put(self, request, email):
        try:
            subscriber = Subscriber.objects.get(email=email)
            new_email = request.data.get('new_email')
            
            if not new_email:
                return Response(
                    {'error': 'New email is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if Subscriber.objects.filter(email=new_email).exists():
                return Response(
                    {'error': 'This email is already registered'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            subscriber.email = new_email
            subscriber.save()
            
            return Response({
                'message': 'Email updated successfully',
                'email': new_email
            }, status=status.HTTP_200_OK)
            
        except Subscriber.DoesNotExist:
            return Response(
                {'error': 'Subscriber not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class NewsTopicListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        topics = NewsTopic.objects.all()
        serializer = NewsTopicSerializer(topics, many=True)
        return Response(serializer.data)

class SubscribeView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        # Check if subscriber already exists
        subscriber, created = Subscriber.objects.get_or_create(email=email)
        
        if created:
            # New subscriber
            return Response({
                'email': subscriber.email,
                'topics': [],
                'is_existing': False
            }, status=status.HTTP_201_CREATED)
        else:
            # Existing subscriber
            topics = subscriber.topics.all()
            return Response({
                'email': subscriber.email,
                'topics': [topic.id for topic in topics],
                'is_existing': True
            }, status=status.HTTP_200_OK)

class SubscriberTopicsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, email):
        try:
            subscriber = Subscriber.objects.get(email=email)
            topics = subscriber.topics.all()
            serializer = NewsTopicSerializer(topics, many=True)
            return Response(serializer.data)
        except Subscriber.DoesNotExist:
            return Response(
                {'error': 'Subscriber not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def put(self, request, email):
        try:
            subscriber = Subscriber.objects.get(email=email)
            topic_ids = request.data.get('topic_ids', [])
            
            if not topic_ids:
                return Response(
                    {'error': 'No topics provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create topics
            topics = []
            for topic_id in topic_ids:
                try:
                    topic = NewsTopic.objects.get(id=topic_id)
                    topics.append(topic)
                except NewsTopic.DoesNotExist:
                    continue
            
            subscriber.topics.set(topics)
            subscriber.save()
            
            serializer = NewsTopicSerializer(topics, many=True)
            return Response({
                'email': subscriber.email,
                'topics': [topic.id for topic in topics],
                'message': 'Topics updated successfully'
            }, status=status.HTTP_200_OK)
        except Subscriber.DoesNotExist:
            return Response(
                {'error': 'Subscriber not found'},
                status=status.HTTP_404_NOT_FOUND
            )