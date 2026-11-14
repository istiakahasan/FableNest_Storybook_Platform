import time
import logging
import os
from typing import Dict, List, Optional
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    logging.warning("OpenAI package not available. Install with: pip install openai")
from .Text_with_image_Schema import (
    TextWithImageRequest,
    GeneratedStory,
    StoryPage,
    GenderEnum,
    StyleEnum,
    LanguageEnum,
    ChapterEnum
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TextWithImageService:
    """Service class for generating stories with images based on user input."""
    
    def __init__(self):
        self.story_templates = self._initialize_story_templates()
        self.style_prompts = self._initialize_style_prompts()
        
        # OpenAI configuration
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_model = "gpt-3.5-turbo"
        
        if OPENAI_AVAILABLE and self.openai_api_key:
            self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
            logger.info("OpenAI API configured successfully")
        else:
            self.openai_client = None
            logger.warning("OpenAI not available or API key not set. Using template-based stories.")
        
    def _initialize_story_templates(self) -> Dict[str, Dict[str, str]]:
        """Initialize story templates for different languages."""
        return {
            "English": {
                "intro": "Once upon a time, there was a {gender_adj} {age}-year-old named {name}.",
                "adventure_start": "{name} discovered something magical that would change everything.",
                "conflict": "But {name} faced a great challenge that tested their courage.",
                "resolution": "With determination and heart, {name} found a way to overcome the obstacle.",
                "ending": "And so {name} learned that with courage and kindness, anything is possible."
            },
            "Spanish": {
                "intro": "Érase una vez, había {gender_adj} {age} años llamado {name}.",
                "adventure_start": "{name} descubrió algo mágico que lo cambiaría todo.",
                "conflict": "Pero {name} enfrentó un gran desafío que puso a prueba su valor.",
                "resolution": "Con determinación y corazón, {name} encontró una manera de superar el obstáculo.",
                "ending": "Y así {name} aprendió que con valor y bondad, todo es posible."
            },
            "French": {
                "intro": "Il était une fois, il y avait {gender_adj} de {age} ans nommé {name}.",
                "adventure_start": "{name} découvrit quelque chose de magique qui allait tout changer.",
                "conflict": "Mais {name} fit face à un grand défi qui testa son courage.",
                "resolution": "Avec détermination et cœur, {name} trouva un moyen de surmonter l'obstacle.",
                "ending": "Et ainsi {name} apprit qu'avec courage et gentillesse, tout est possible."
            },
            "Italian": {
                "intro": "C'era una volta {gender_adj} di {age} anni chiamato {name}.",
                "adventure_start": "{name} scoprì qualcosa di magico che avrebbe cambiato tutto.",
                "conflict": "Ma {name} affrontò una grande sfida che mise alla prova il suo coraggio.",
                "resolution": "Con determinazione e cuore, {name} trovò un modo per superare l'ostacolo.",
                "ending": "E così {name} imparò che con coraggio e gentilezza, tutto è possibile."
            },
            "Arabic": {
                "intro": "كان يا ما كان، كان هناك {gender_adj} يبلغ من العمر {age} عامًا يُدعى {name}.",
                "adventure_start": "اكتشف {name} شيئًا سحريًا من شأنه أن يغير كل شيء.",
                "conflict": "لكن {name} واجه تحديًا كبيرًا اختبر شجاعته.",
                "resolution": "بالعزيمة والقلب، وجد {name} طريقة للتغلب على العقبة.",
                "ending": "وهكذا تعلم {name} أنه بالشجاعة واللطف، كل شيء ممكن."
            }
        }
    
    def _initialize_style_prompts(self) -> Dict[str, str]:
        """Initialize style-specific prompts for image generation."""
        return {
            "Cartoon": "bright, animated, cartoon-style illustration with bold colors and fun characters",
            "Storybook": "classic storybook illustration with soft watercolor style and whimsical details",
            "Illustration": "detailed digital illustration with rich colors and artistic composition",
            "Colorful": "vibrant, colorful artwork with dynamic composition and cheerful atmosphere",
            "Simple": "minimalist, clean illustration with simple shapes and gentle colors"
        }
    
    def _get_gender_adjective(self, gender: str, language: str) -> str:
        """Get gender-appropriate adjective for different languages."""
        gender_map = {
            "English": {"Male": "a young boy", "Female": "a young girl"},
            "Spanish": {"Male": "un niño", "Female": "una niña"},
            "French": {"Male": "un garçon", "Female": "une fille"},
            "Italian": {"Male": "un ragazzo", "Female": "una ragazza"},
            "Arabic": {"Male": "فتى", "Female": "فتاة"}
        }
        return gender_map.get(language, {}).get(gender, "a child")
    
    def _determine_pages_count(self) -> int:
        """Return fixed page count of 22 chapters."""
        return 22
    
    def _ensure_character_count(self, description: str, min_chars: int = 800, max_chars: int = 1000) -> str:
        """Ensure description is between min_chars and max_chars."""
        char_count = len(description)
        
        if char_count < min_chars:
            # Expand description with additional details
            padding_phrases = [
                "The illustration features rich details and textures.",
                "Every element is carefully composed for visual harmony.",
                "The color palette enhances the scene's mood.",
                "Background elements add depth and context.",
                "Lighting creates dimension throughout the scene.",
                "The artistic style remains consistent.",
                "Attention to detail enhances the narrative.",
                "The composition guides the viewer naturally.",
                "Textures add visual interest.",
                "Character expressions convey emotion."
            ]
            
            idx = 0
            while len(description) < min_chars and idx < len(padding_phrases):
                description += " " + padding_phrases[idx]
                idx += 1
        
        # Ensure we don't exceed max_chars
        if len(description) > max_chars:
            description = description[:max_chars].rsplit(' ', 1)[0]  # Cut at last complete word
        
        return description

    
    def _generate_story_content(self, request: TextWithImageRequest) -> List[StoryPage]:
        """Generate story content based on user inputs."""
        pages = []
        total_pages = self._determine_pages_count()
        templates = self.story_templates.get(request.language, self.story_templates["English"])
        gender_adj = self._get_gender_adjective(request.gender, request.language)
        
        # Base story elements
        story_elements = {
            "name": request.name,
            "age": request.age,
            "gender_adj": gender_adj,
            "idea": request.story_idea
        }
        
        if total_pages == 1:
            # Single page story
            content = f"{templates['intro'].format(**story_elements)} {request.story_idea} {templates['ending'].format(**story_elements)}"
            page_title = f"The Adventure of {request.name}"
            image_description = self._generate_image_description(content, request.name, request.style, 1, request, page_title)
            pages.append(StoryPage(
                page_number=1,
                title=page_title,
                content=content,
                image_description=image_description
            ))
        else:
            # Multi-page story
            story_structure = [
                ("Introduction", templates["intro"]),
                ("Adventure Begins", templates["adventure_start"]),
                ("The Challenge", templates["conflict"]),
                ("Resolution", templates["resolution"]),
                ("Happy Ending", templates["ending"])
            ]
            
            # Distribute content across pages
            for i in range(total_pages):
                if i < len(story_structure):
                    title, template = story_structure[i]
                    content = template.format(**story_elements)
                    if i == 1:  # Adventure begins page
                        content += f" {request.story_idea}"
                else:
                    title = f"Chapter {i + 1}"
                    content = f"The story of {request.name} continues with new adventures and discoveries."
                
                image_description = self._generate_image_description(content, request.name, request.style, i + 1, request, title)
                pages.append(StoryPage(
                    page_number=i + 1,
                    title=title,
                    content=content,
                    image_description=image_description
                ))
        
        return pages
    
    def _generate_openai_story(self, request: TextWithImageRequest) -> List[StoryPage]:
        """Generate story content using OpenAI API with 25-word limit per page."""
        import random
        pages = []
        total_pages = self._determine_pages_count()
        
        if not OPENAI_AVAILABLE or not self.openai_client:
            # Fallback to template-based generation
            return self._generate_template_story(request)
        
        try:
            # Add randomness elements for unique story generation
            random_seed = random.randint(1, 10000)
            time_of_dream = random.choice(["one magical night", "during a peaceful afternoon nap", "while drifting off to sleep", "on a cozy evening"])
            dream_transition = random.choice(["closed their eyes and entered a wonderful dream", "drifted into the most amazing dream", "fell asleep and found themselves in a magical dream world", "began dreaming the most incredible adventure"])
            
            # Create OpenAI prompt for story generation
            prompt = f"""
            Create a UNIQUE and ORIGINAL {total_pages}-page children's story written as a CHILD'S DREAM. This is story generation #{random_seed}.
            
            STORY FRAMEWORK:
            - Main Character: {request.name}, a {request.age}-year-old {request.gender.lower()} child who is the DREAMER
            - Story Idea/Theme: {request.story_idea}
            - Language: {request.language}
            - Style: {request.style}
            
            CRITICAL REQUIREMENTS - READ CAREFULLY:
            
            1. DREAM NARRATIVE STRUCTURE:
               - Start with {request.name} in real life {time_of_dream}, then they {dream_transition}
               - The entire adventure happens IN THE DREAM - {request.name} is experiencing it as the main character
               - Write from {request.name}'s perspective, making them feel like the hero of their own dream
               - End with {request.name} waking up, enriched by the dream experience
            
            2. STORY MUST BE UNIQUE AND FRESH:
               - DO NOT use template phrases or repetitive structures
               - Generate the story LINE BY LINE organically based on the story idea
               - Each story with the same idea MUST be completely different in plot, events, and expressions
               - Use creative and varied vocabulary, avoid predictable patterns
               - Develop unexpected plot twists and unique character interactions
               - Make each page feel fresh and engaging, not formulaic
            
            3. CHARACTER AS PROTAGONIST:
               - {request.name} must be actively involved in every scene, not just observing
               - Show {request.name}'s emotions, thoughts, decisions, and actions
               - Use "I" statements or direct focus on {request.name}'s experience
               - Make young readers feel like they ARE {request.name} in the dream
            
            4. STORY DEVELOPMENT ({total_pages} pages):
               - Pages 1-2: Real life moment + entering the dream
               - Pages 3-7: Dream world introduction and {request.story_idea} begins to unfold
               - Pages 8-14: Main adventure with challenges, discoveries, emotions - fully develop {request.story_idea}
               - Pages 15-19: Climax, resolution, emotional peak of the dream
               - Pages 20-21: Dream concludes, lessons learned within the dream
               - Page 22: Waking up, reflecting on the amazing dream experience
            
            5. TECHNICAL REQUIREMENTS:
               - EXACTLY 25 words or less per page
               - Write in {request.language}
               - Age-appropriate for {request.age}-year-old children
               - Emotionally engaging and relatable
               - Each page advances the narrative meaningfully
            
            6. VARIETY AND UNIQUENESS:
               - Even if you receive the same story_idea again, create ENTIRELY DIFFERENT:
                 * Plot events and sequence
                 * Character interactions and dialogue
                 * Settings and scene descriptions
                 * Emotional moments and turning points
                 * Word choices and sentence structures
               - Think of this as story variation #{random_seed} - make it truly distinct
            
            Format your response as JSON:
            {{
                "pages": [
                    {{
                        "page_number": 1,
                        "title": "Page Title",
                        "content": "Story content (max 25 words)"
                    }}
                ]
            }}
            """
            
            logger.info(f"Generating {total_pages}-page story using OpenAI")
            
            # Make API call to OpenAI with higher temperature for more creativity and variety
            response = self.openai_client.chat.completions.create(
                model=self.openai_model,
                messages=[
                    {"role": "system", "content": "You are a creative children's story writer who specializes in writing unique, engaging dream adventures. Each story you write is completely original and different, even with similar prompts. You write from the child's perspective, making them the hero of their own dream. Always respond with valid JSON format."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.9
            )
            
            # Parse the response
            import json
            content = response.choices[0].message.content
            story_data = json.loads(content)
            
            # Create StoryPage objects with image descriptions
            for page_data in story_data["pages"]:
                # Generate detailed image description based on actual page content with consistent character design
                image_description = self._generate_image_description(
                    page_data["content"], 
                    request.name, 
                    request.style,
                    page_data["page_number"],
                    request,
                    page_data["title"]
                )
                
                pages.append(StoryPage(
                    page_number=page_data["page_number"],
                    title=page_data["title"],
                    content=page_data["content"],
                    image_description=image_description
                ))
            
            logger.info(f"Successfully generated {len(pages)} pages using OpenAI")
            
            # Add two coloring pages
            pages = self._add_coloring_pages(pages, request)
            
            return pages
            
        except Exception as e:
            logger.error(f"OpenAI generation failed: {str(e)}. Falling back to templates.")
            return self._generate_template_story(request)
    
    def _generate_image_description(self, content: str, character_name: str, style: str, page_number: int, request: TextWithImageRequest = None, page_title: str = None) -> str:
        """Generate detailed image description based on specific page content, maintaining consistency with cover design."""
        # Use base character description for consistency across all pages
        if request:
            base_character_desc = self._generate_base_character_description(request)
        else:
            style_prompt = self.style_prompts.get(style, "illustration")
            base_character_desc = f"{style_prompt}, featuring {character_name} as the main character"
        
        content_lower = content.lower()
        
        # Extract detailed scene elements from content
        scene_elements = []
        objects_and_items = []
        character_actions = []
        emotions_and_mood = []
        
        # Enhanced location detection with more specific descriptions
        locations = {
            "forest": ["forest", "trees", "woods", "jungle"],
            "magical enchanted forest with glowing trees and fairy lights": ["magical forest", "enchanted", "fairy"],
            "royal castle with tall towers and golden gates": ["castle", "palace", "kingdom", "royal"],
            "beautiful garden with colorful flowers and butterflies": ["garden", "flowers", "butterfly", "bloom"],
            "mysterious cave with sparkling crystals": ["cave", "crystal", "underground"],
            "peaceful meadow with rolling hills": ["meadow", "field", "grass", "hills"],
            "cozy home with warm lighting": ["home", "house", "room", "attic"],
            "starry night sky with twinkling stars": ["night", "stars", "moon", "sky"],
            "sunny beach with golden sand": ["beach", "sand", "ocean", "sea"],
            "snowy mountain peak": ["mountain", "snow", "peak", "cold"]
        }
        
        location_found = "in a whimsical storybook setting"
        for location_desc, keywords in locations.items():
            if any(keyword in content_lower for keyword in keywords):
                location_found = f"in {location_desc}"
                break
        
        # Enhanced object and item detection
        items = {
            "holding a magical paintbrush": ["paint", "brush", "canvas", "art"],
            "surrounded by colorful butterflies": ["butterfly", "butterflies"],
            "with a wise owl companion": ["owl", "bird"],
            "near a treasure chest": ["treasure", "chest", "gold"],
            "with a glowing wand": ["wand", "magic", "spell"],
            "reading an ancient book": ["book", "reading", "story"],
            "wearing a beautiful crown": ["crown", "princess", "prince"],
            "with a friendly dragon": ["dragon", "creature"],
            "holding a lantern": ["lantern", "light", "glow"],
            "with musical instruments": ["music", "song", "singing"]
        }
        
        for item_desc, keywords in items.items():
            if any(keyword in content_lower for keyword in keywords):
                objects_and_items.append(item_desc)
        
        # Enhanced action detection
        actions = {
            "dancing gracefully": ["dance", "dancing", "twirl"],
            "running through the scene": ["running", "chase", "hurry", "race"],
            "flying through the air": ["fly", "flying", "soar"],
            "climbing or exploring": ["climb", "explore", "adventure"],
            "painting or creating art": ["paint", "draw", "create", "art"],
            "discovering something wonderful": ["discover", "find", "found", "surprise"],
            "talking to animals": ["talk", "speak", "conversation", "animal"],
            "solving a puzzle or problem": ["solve", "think", "problem", "puzzle"],
            "helping friends": ["help", "friend", "together", "team"],
            "celebrating or cheering": ["celebrate", "cheer", "victory", "success"]
        }
        
        for action_desc, keywords in actions.items():
            if any(keyword in content_lower for keyword in keywords):
                character_actions.append(action_desc)
        
        # Enhanced emotion and mood detection
        emotions = {
            "with a bright, joyful smile": ["happy", "joy", "smile", "laugh", "giggle"],
            "with wonder and curiosity in their eyes": ["wonder", "curious", "amazed", "surprise"],
            "with determination and courage": ["brave", "courage", "determined", "strong"],
            "with a gentle, kind expression": ["kind", "gentle", "caring", "love"],
            "with excitement and energy": ["excited", "energy", "enthusiastic"],
            "with peaceful contentment": ["peaceful", "calm", "content", "serene"],
            "with focused concentration": ["focus", "concentrate", "think", "study"],
            "with magical sparkles around them": ["magic", "magical", "sparkle", "glow"]
        }
        
        for emotion_desc, keywords in emotions.items():
            if any(keyword in content_lower for keyword in keywords):
                emotions_and_mood.append(emotion_desc)
        
        # Create page description similar to cover format
        scene_elements = []
        
        if character_actions:
            scene_elements.append(character_actions[0])
        
        if objects_and_items:
            scene_elements.append(objects_and_items[0])
        
        scene_elements.append(location_found)
        
        if emotions_and_mood:
            scene_elements.append(emotions_and_mood[0])
        
        # Build description in cover-like format
        page_description = f"Page {page_number} illustration design. {base_character_desc}. "
        
        # Add scene description (similar to cover scene)
        if scene_elements:
            page_description += f"Page scene depicts {', '.join(scene_elements[:2])}. "
        else:
            page_description += "Page scene depicts the story content in an engaging atmosphere. "
        
        # Add detailed scene context
        page_description += (
            "The illustration captures the narrative moment with clarity. "
            "Character positioning and expressions convey the story effectively. "
            "Background elements support narrative context. "
            "Color choices reflect scene mood and tone."
        )
        
        # End similar to cover format
        page_description += " Colorful, engaging design suitable for children's book"
        
        # Ensure character count is between 800-1000
        page_description = self._ensure_character_count(page_description, 800, 1000)
        
        return page_description
    
    def _generate_base_character_description(self, request: TextWithImageRequest) -> str:
        """Generate base character description for consistent visual design across all images."""
        style_prompt = self.style_prompts.get(request.style, "illustration")
        gender_adj = self._get_gender_adjective(request.gender, request.language).lower()
        
        # Create consistent character design description
        base_character_desc = (
            f"{style_prompt}, featuring {request.name} as the main character, "
            f"{gender_adj} of {request.age} years old. "
            f"Character design: consistent appearance with {request.style.lower()} artistic style, "
            f"same facial features, hair style, clothing, and proportions throughout. "
            f"Story theme: {request.story_idea}"
        )
        
        return base_character_desc
    
    def _generate_cover_image_description(self, request: TextWithImageRequest) -> str:
        """Generate a book cover description based on story details with 800-1000 character limit."""
        base_character_desc = self._generate_base_character_description(request)
        
        # Create cover description using base character design
        cover_description = (
            f"Book cover design. {base_character_desc}. "
            f"Title '{self._generate_story_title(request.name)}' prominently displayed at the top. "
            f"Cover scene depicts the main story theme in an inviting and magical atmosphere. "
            f"Colorful, eye-catching design suitable for children's book. "
            f"The cover establishes visual tone for the story. "
            f"Main character featured prominently in engaging pose. "
            f"Background hints at adventure themes within."
        )
        
        # Ensure character count is between 800-1000
        cover_description = self._ensure_character_count(cover_description, 800, 1000)
        
        return cover_description
    
    def _generate_story_title(self, character_name: str) -> str:
        """Generate story title based on character name."""
        return f"The Amazing Adventures of {character_name}"
    
    def _generate_template_story(self, request: TextWithImageRequest) -> List[StoryPage]:
        """Fallback method using dynamic generation when OpenAI is not available."""
        import random
        pages = []
        total_pages = self._determine_pages_count()
        
        # Create dynamic story with randomness
        random_seed = random.randint(1, 10000)
        
        # Random story variations
        dream_starts = [
            f"One evening, {request.name} closed their eyes and began to dream.",
            f"{request.name} fell asleep and entered the most magical dream.",
            f"As {request.name} drifted off, a wonderful dream began.",
            f"In a cozy moment, {request.name} started dreaming an amazing adventure."
        ]
        
        dream_worlds = [
            "a world where anything was possible",
            "a magical realm full of wonder",
            "an incredible place beyond imagination",
            "a fantastic world of endless adventure"
        ]
        
        challenges = [
            "faced an exciting challenge",
            "discovered something surprising",
            "encountered a mysterious situation",
            "found themselves in an unexpected moment"
        ]
        
        emotions = [
            "felt brave and determined",
            "discovered inner courage",
            "embraced the adventure with joy",
            "found strength within"
        ]
        
        resolutions = [
            "found a creative solution",
            "discovered the answer",
            "made everything work perfectly",
            "achieved something wonderful"
        ]
        
        wake_ups = [
            f"{request.name} woke up with a smile, remembering the incredible dream.",
            f"Opening their eyes, {request.name} felt inspired by the magical dream.",
            f"{request.name} awoke, carrying the dream's joy in their heart.",
            f"The dream ended, but {request.name} felt forever changed."
        ]
        
        # Build dynamic story pages
        story_parts = [
            random.choice(dream_starts),
            f"In the dream, {request.name} found themselves in {random.choice(dream_worlds)}.",
            f"The dream took {request.name} on an adventure: {request.story_idea}.",
            f"{request.name} explored this dream world with wonder and curiosity.",
            f"Everything in the dream felt real and magical to {request.name}.",
            f"As the dream continued, {request.name} {random.choice(challenges)}.",
            f"{request.name} {random.choice(emotions)} facing the dream's surprises.",
            f"In this dream, {request.name} could do amazing things.",
            f"The adventure grew more exciting as {request.name} discovered new abilities.",
            f"Dream friends appeared to help {request.name} on the journey.",
            f"Together in the dream, they explored and laughed joyfully.",
            f"{request.name} learned important lessons within the dream world.",
            f"The dream adventure reached its most exciting moment.",
            f"With dream courage, {request.name} {random.choice(resolutions)}.",
            f"Everything in the dream came together beautifully.",
            f"{request.name} felt proud and happy in the dream.",
            f"The dream showed {request.name} the power of imagination.",
            f"As the dream reached its end, {request.name} felt grateful.",
            f"The magical dream adventure began to fade gently.",
            f"{request.name} knew this dream would stay in their heart.",
            f"The best part was that {request.name} was the hero.",
            random.choice(wake_ups)
        ]
        
        # Shuffle middle sections for variety
        middle_sections = story_parts[3:-3]
        random.shuffle(middle_sections)
        story_parts = story_parts[:3] + middle_sections + story_parts[-3:]
        
        for i in range(total_pages):
            if i < len(story_parts):
                content = story_parts[i]
            else:
                content = f"{request.name} continued their amazing dream adventure with new discoveries."
            
            # Limit to 25 words
            content = " ".join(content.split()[:25])
            
            page_title = f"Chapter {i + 1}"
            pages.append(StoryPage(
                page_number=i + 1,
                title=page_title,
                content=content,
                image_description=self._generate_image_description(content, request.name, request.style, i + 1, request, page_title)
            ))
        
        # Add two coloring pages
        pages = self._add_coloring_pages(pages, request)
        
        return pages
    
    def _add_coloring_pages(self, pages: List[StoryPage], request: TextWithImageRequest) -> List[StoryPage]:
        """Add two different black and white coloring pages to the story."""
        # Create first coloring page (beginning scene)
        coloring_page_1 = self._create_coloring_page(len(pages) + 1, request, pages, page_type="beginning")
        # Create second coloring page (ending scene)
        coloring_page_2 = self._create_coloring_page(len(pages) + 2, request, pages, page_type="ending")
        
        # Add both coloring pages at the end
        pages.append(coloring_page_1)
        pages.append(coloring_page_2)
        
        # Renumber all pages
        for idx, page in enumerate(pages, start=1):
            page.page_number = idx
        
        return pages
    
    def _create_coloring_page(self, position: int, request: TextWithImageRequest, pages: List[StoryPage], page_type: str = "beginning") -> StoryPage:
        """Create a black and white coloring page based on story content.
        
        Args:
            position: Page position in the story
            request: Story request data
            pages: List of story pages
            page_type: "beginning" for first coloring page (early story scene) or "ending" for second (final scene)
        """
        # Get reference page based on page_type
        if page_type == "beginning":
            # Reference early pages for first coloring page
            ref_page_idx = min(3, len(pages) - 1) if pages else 0
        else:
            # Reference final pages for second coloring page
            ref_page_idx = len(pages) - 1 if pages else 0
        
        ref_page = pages[ref_page_idx] if pages and ref_page_idx < len(pages) else None
        
        # Create coloring page content based on page_type
        if request.language == "English":
            if page_type == "beginning":
                content = f"Color and draw {request.name}'s adventure beginning!"
                title = "Coloring Page 1"
            else:
                content = f"Color and draw {request.name}'s happy ending!"
                title = "Coloring Page 2"
        elif request.language == "Spanish":
            if page_type == "beginning":
                content = f"¡Colorea y dibuja el inicio de la aventura de {request.name}!"
                title = "Página para Colorear 1"
            else:
                content = f"¡Colorea y dibuja el final feliz de {request.name}!"
                title = "Página para Colorear 2"
        elif request.language == "French":
            if page_type == "beginning":
                content = f"Coloriez et dessinez le début de l'aventure de {request.name}!"
                title = "Page de Coloriage 1"
            else:
                content = f"Coloriez et dessinez la fin heureuse de {request.name}!"
                title = "Page de Coloriage 2"
        elif request.language == "Italian":
            if page_type == "beginning":
                content = f"Colora e disegna l'inizio dell'avventura di {request.name}!"
                title = "Pagina da Colorare 1"
            else:
                content = f"Colora e disegna il lieto fine di {request.name}!"
                title = "Pagina da Colorare 2"
        elif request.language == "Arabic":
            if page_type == "beginning":
                content = f"لون وارسم بداية مغامرة {request.name}!"
                title = "صفحة التلوين 1"
            else:
                content = f"لون وارسم نهاية {request.name} السعيدة!"
                title = "صفحة التلوين 2"
        else:
            if page_type == "beginning":
                content = f"Color and draw {request.name}'s adventure beginning!"
                title = "Coloring Page 1"
            else:
                content = f"Color and draw {request.name}'s happy ending!"
                title = "Coloring Page 2"
        
        # Generate black and white line art description
        image_description = self._generate_coloring_page_description(request, ref_page, page_type)
        
        return StoryPage(
            page_number=position,
            title=title,
            content=content,
            image_description=image_description
        )
    
    def _generate_coloring_page_description(self, request: TextWithImageRequest, ref_page: Optional[StoryPage] = None, page_type: str = "beginning") -> str:
        """Generate description for black and white coloring page with 800-1000 character limit.
        
        Args:
            request: Story request data
            ref_page: Reference page for context
            page_type: "beginning" for early story scene or "ending" for final scene
        """
        # Different scene descriptions based on page_type
        if page_type == "beginning":
            scene_context = f"showing the beginning of {request.name}'s adventure"
        else:
            scene_context = f"showing the happy ending or conclusion of {request.name}'s adventure"
        
        base_desc = (
            f"Black and white line art coloring page. Simple, clean outlines with no shading or color fills. "
            f"Features {request.name}, a {request.age}-year-old {request.gender.lower()} character, "
            f"in a simple scene {scene_context}, related to {request.story_idea}. "
        )
        
        if ref_page:
            base_desc += f"Scene inspired by the story narrative at that point. "
        
        base_desc += (
            "Clear, bold black outlines on white background. "
            "Simple shapes suitable for children to color. "
            "No colors, grayscale, or shading - pure line art only for coloring activity. "
            "Line thickness consistent and appropriate for young children. "
            "Design includes simple and complex areas for varied skill levels. "
            "Character recognizable and consistent with story illustrations."
        )
        
        # Ensure character count is between 800-1000
        base_desc = self._ensure_character_count(base_desc, 800, 1000)
        
        return base_desc

    def generate_story_with_images(self, request: TextWithImageRequest) -> GeneratedStory:
        """Generate a complete story with images based on user input."""
        try:
            logger.info(f"Generating story for {request.name} with 22 chapters")
            
            # Generate story pages using OpenAI
            pages = self._generate_openai_story(request)
            
            # Create the complete story
            story = GeneratedStory(
                story_title=self._generate_story_title(request.name),
                character_name=request.name,
                character_gender=request.gender,
                character_age=request.age,
                style=request.style,
                language=request.language,
                total_chapters=len(pages),
                cover_image_description=self._generate_cover_image_description(request),
                pages=pages
            )
            
            logger.info(f"Successfully generated story with {len(pages)} pages")
            return story
            
        except Exception as e:
            logger.error(f"Error generating story: {str(e)}")
            raise Exception(f"Failed to generate story: {str(e)}")
    
    def get_service_info(self) -> dict:
        """Get service information and capabilities."""
        return {
            "service": "Text with Image Story Generator",
            "description": "Generate personalized stories with custom characters and images",
            "version": "1.0.0",
            "supported_genders": [gender.value for gender in GenderEnum],
            "supported_styles": [style.value for style in StyleEnum],
            "supported_languages": [lang.value for lang in LanguageEnum],
            "supported_chapters": [chapter.value for chapter in ChapterEnum],
            "features": [
                "Personalized character integration",
                "Multi-language support",
                "Various artistic styles",
                "Flexible chapter lengths",
                "Image-based character representation"
            ]
        }