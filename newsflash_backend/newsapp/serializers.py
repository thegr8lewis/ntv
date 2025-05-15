from rest_framework import serializers
from .models import NewsTopic, Subscriber


from .models import NewsItem, NewsInteraction, UserBehavior

class NewsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsItem
        fields = '__all__'

class NewsInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsInteraction
        fields = ['news_item', 'liked', 'viewed', 'view_count']

class UserBehaviorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBehavior
        fields = ['event_type', 'event_data', 'timestamp']


class NewsTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsTopic
        fields = ['id', 'name', 'icon']

class SubscriberSerializer(serializers.ModelSerializer):
    topics = NewsTopicSerializer(many=True, read_only=True)
    topic_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Subscriber
        fields = ['email', 'topics', 'topic_ids']
        extra_kwargs = {'email': {'required': True}}
    
    def create(self, validated_data):
        topic_ids = validated_data.pop('topic_ids', [])
        subscriber, created = Subscriber.objects.get_or_create(
            email=validated_data['email'],
            defaults=validated_data
        )
        
        if topic_ids:
            topics = NewsTopic.objects.filter(id__in=topic_ids)
            subscriber.topics.set(topics)
        
        return subscriber