from database import get_database
import uuid
import random

from faker.providers import DynamicProvider

randomTextQuestions = DynamicProvider(
     provider_name="randomTextQuestions",
     elements=["Why do you want this?", "What can you do?", "Why is the sky blue", "Do you think backend is worse than frontend?", "What benefit will you bring to PFW?", "Why do you think database devs are very important?", "What is two plus two?", "Where do you see yourself in five years?", "What day is it?", "What is your name?", "How do you get from A to B?", "When is your birthday?"]
)

randomRadioQuestions = DynamicProvider(
     provider_name="randomRadioQuestions",
     elements=["Yes or no?", "Random choice?", "Foo or Fee?"]
)

RandomCheckboxQuestions = DynamicProvider(
     provider_name="randomCheckboxQuestions",
     elements=["Yes or no?", "Random choice?", "Foo or Fee?"]
)