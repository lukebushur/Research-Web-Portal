from database import get_database

# TODO
# fetch the most recent Majors in the database?

from faker.providers import DynamicProvider

random_pfw_majors = DynamicProvider(
     provider_name="random_pfw_major",
     elements=['Business', 'General Studies', 'Elementary Education', 'Experimental Psychology', 'Biology', 'Organizational Leadership', 'Human Services', 'Speech Communication', 'Public Administration', 'Secondary Education', 'Audiology', 'English Literature', 'Mathematics', 'History', 'Mechanical Engineering', 'Music', 'Kindergarten Education', 'Art Studies', 'Interior Design', 'Computer Engineering', 'Biochemistry', 'Electrical Engineering', 'Communications Engineering', 'Physics', 'Political Science', 'Computer Science', 'Information Technology', 'Music Education', 'Civil Engineering', 'Economics', 'Theatre', 'Music Therapy', 'Construction Engineering', 'Chemistry', 'Fine Arts', 'Hotel Administration', 'Spanish Literature', 'Sociology', 'Anthropology', "Women's Studies", 'Art Education', 'Industrial Technology', 'Actuarial Science', 'Music Performance', 'Other']
)
