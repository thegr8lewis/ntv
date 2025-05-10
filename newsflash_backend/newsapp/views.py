
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import NewsTopic, Subscriber
from .serializers import NewsTopicSerializer, SubscriberSerializer

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