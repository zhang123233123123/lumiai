"""
LumiAI - 示例数据填充
预置一些雅思阅读题目用于 Demo 演示
"""
from app.database import SessionLocal
from app.models.user import User
from app.models.question import Question
from app.models.practice import PracticeSession, PracticeAnswer
import json


def seed_database():
    """填充示例数据"""
    db = SessionLocal()
    
    try:
        # 检查是否已有数据
        if db.query(Question).first():
            print("数据库已有数据，跳过填充")
            return
        
        print("正在填充示例数据...")
        
        # 创建 Demo 用户
        demo_user = db.query(User).filter(User.id == 1).first()
        if not demo_user:
            demo_user = User(
                id=1,
                username="Sarah",
                email="sarah@demo.com",
                target_score="7.5"
            )
            db.add(demo_user)
        
        # 阅读题目 - 基于剑桥雅思真题风格
        reading_passage = """The Future of Interstellar Travel

As humanity looks towards the stars, the challenges of interstellar travel remain daunting. The sheer distances involved are difficult to comprehend. The nearest star system, Alpha Centauri, is over 4 light-years away. Current propulsion technologies, such as chemical rockets, would take tens of thousands of years to reach even our closest stellar neighbors.

To bridge this gap, scientists are exploring revolutionary concepts like nuclear thermal propulsion, solar sails, and antimatter engines. Nuclear thermal propulsion uses a nuclear reactor to heat a propellant, offering higher efficiency than chemical rockets. Solar sails, on the other hand, use the pressure of sunlight to gradually accelerate a spacecraft over time.

Beyond propulsion, the human factor poses significant risks. Long-duration spaceflight exposes astronauts to cosmic radiation, muscle atrophy, and psychological stress. Creating a self-sustaining habitat for a multi-generational journey requires advancements in closed-loop life support systems.

Time dilation, a phenomenon predicted by Einstein's theory of relativity, also plays a role. At speeds approaching the speed of light, time passes more slowly for travelers compared to those on Earth. This means that while a journey might take decades for the crew, centuries could pass on Earth.

Several organizations have proposed ambitious interstellar missions. The Breakthrough Starshot project aims to send tiny spacecraft to Alpha Centauri using powerful ground-based lasers to accelerate them to 20% of the speed of light. Such a mission could reach Alpha Centauri within 20 years."""
        
        reading_questions = [
            {
                "title": "Alpha Centauri Distance",
                "question_type": "fill_in_blank",
                "difficulty": "medium",
                "content": "The primary challenge of reaching Alpha Centauri is the ______ involved.",
                "answer": "distances",
                "explanation": "文章第一段提到 'The sheer distances involved are difficult to comprehend.'",
                "source": "Cambridge 18 - Test 2"
            },
            {
                "title": "Chemical Rockets Duration",
                "question_type": "fill_in_blank", 
                "difficulty": "hard",
                "content": "Using chemical rockets, it would take ______ of years to reach our nearest stellar neighbors.",
                "answer": "tens of thousands",
                "explanation": "文章提到 'Current propulsion technologies, such as chemical rockets, would take tens of thousands of years'",
                "source": "Cambridge 18 - Test 2"
            },
            {
                "title": "Nuclear Thermal Propulsion",
                "question_type": "true_false_ng",
                "difficulty": "medium",
                "content": "Nuclear thermal propulsion is more efficient than chemical rockets.\n\nA) TRUE\nB) FALSE\nC) NOT GIVEN",
                "options": json.dumps(["TRUE", "FALSE", "NOT GIVEN"]),
                "answer": "TRUE",
                "explanation": "文章明确提到 'Nuclear thermal propulsion...offering higher efficiency than chemical rockets'",
                "source": "Cambridge 18 - Test 2"
            },
            {
                "title": "Solar Sail Mechanism",
                "question_type": "fill_in_blank",
                "difficulty": "medium",
                "content": "Solar sails use the pressure of ______ to accelerate spacecraft.",
                "answer": "sunlight",
                "explanation": "文章提到 'Solar sails...use the pressure of sunlight to gradually accelerate a spacecraft'",
                "source": "Cambridge 18 - Test 2"
            },
            {
                "title": "Astronaut Health Risks",
                "question_type": "multiple_choice",
                "difficulty": "easy",
                "content": "Which of the following is NOT mentioned as a risk to astronauts during long-duration spaceflight?\n\nA) Cosmic radiation\nB) Muscle atrophy\nC) Bone density loss\nD) Psychological stress",
                "options": json.dumps(["Cosmic radiation", "Muscle atrophy", "Bone density loss", "Psychological stress"]),
                "answer": "C",
                "explanation": "文章提到 cosmic radiation, muscle atrophy, psychological stress，但没有提到 bone density loss",
                "source": "Cambridge 18 - Test 2"
            },
            {
                "title": "Time Dilation Effect",
                "question_type": "true_false_ng",
                "difficulty": "hard",
                "content": "According to the passage, time passes more quickly for space travelers at high speeds.\n\nA) TRUE\nB) FALSE\nC) NOT GIVEN",
                "options": json.dumps(["TRUE", "FALSE", "NOT GIVEN"]),
                "answer": "FALSE",
                "explanation": "文章说 'At speeds approaching the speed of light, time passes more slowly for travelers'，所以时间过得更慢，不是更快",
                "source": "Cambridge 18 - Test 2"
            },
            {
                "title": "Breakthrough Starshot Speed",
                "question_type": "fill_in_blank",
                "difficulty": "medium",
                "content": "The Breakthrough Starshot project plans to accelerate spacecraft to ______% of the speed of light.",
                "answer": "20",
                "explanation": "文章提到 'accelerate them to 20% of the speed of light'",
                "source": "Cambridge 18 - Test 2"
            },
            {
                "title": "Closed-loop Systems",
                "question_type": "true_false_ng",
                "difficulty": "hard",
                "content": "Closed-loop life support systems have already been successfully developed for multi-generational journeys.\n\nA) TRUE\nB) FALSE\nC) NOT GIVEN",
                "options": json.dumps(["TRUE", "FALSE", "NOT GIVEN"]),
                "answer": "NOT GIVEN",
                "explanation": "文章只提到需要 'advancements in closed-loop life support systems'，并没有说是否已经开发成功",
                "source": "Cambridge 18 - Test 2"
            },
        ]
        
        # 添加阅读题目
        for q in reading_questions:
            question = Question(
                category="reading",
                question_type=q["question_type"],
                difficulty=q["difficulty"],
                title=q["title"],
                passage=reading_passage,
                content=q["content"],
                options=q.get("options"),
                answer=q["answer"],
                explanation=q.get("explanation"),
                source=q.get("source"),
                skill_tags=json.dumps(["阅读理解", "细节定位"])
            )
            db.add(question)
        
        # 添加一些听力题目
        listening_questions = [
            {
                "title": "Space History Section 2",
                "question_type": "fill_in_blank",
                "difficulty": "medium",
                "content": "The first successful landing on Mars was in the year ______.",
                "answer": "1976",
                "source": "Cambridge 17 - Test 1"
            },
            {
                "title": "Plural Forms - Section 4",
                "question_type": "fill_in_blank",
                "difficulty": "hard",
                "content": "The research team discovered several ______ in the cave system.",
                "answer": "fossils",
                "explanation": "注意听清复数形式 's' 的发音",
                "source": "Cambridge 16 - Section 4"
            }
        ]
        
        for q in listening_questions:
            question = Question(
                category="listening",
                question_type=q["question_type"],
                difficulty=q["difficulty"],
                title=q["title"],
                content=q["content"],
                answer=q["answer"],
                explanation=q.get("explanation"),
                source=q.get("source"),
                skill_tags=json.dumps(["听力理解", "细节捕捉"])
            )
            db.add(question)
        
        # 添加写作题目
        writing_question = Question(
            category="writing",
            question_type="essay",
            difficulty="hard",
            title="Technology and Society",
            content="""Some people believe that technological developments lead to the loss of traditional cultures. Others think that technology helps to keep cultural traditions alive.

Discuss both views and give your own opinion.

Write at least 250 words.""",
            answer="This is an open-ended essay question.",
            source="Cambridge 18 - Writing Task 2",
            skill_tags=json.dumps(["论证能力", "语法运用", "词汇多样性"])
        )
        db.add(writing_question)
        
        # 添加口语题目
        speaking_question = Question(
            category="speaking",
            question_type="short_answer",
            difficulty="medium",
            title="Technological Innovation",
            content="""Describe a technological innovation that you think is important.

You should say:
- What it is
- How you use it
- Why it is important

And explain how it has changed people's lives.""",
            answer="Open-ended speaking task",
            source="Speaking Part 2 - Current Topics",
            skill_tags=json.dumps(["流利度", "发音", "词汇"])
        )
        db.add(speaking_question)
        
        # 添加一些模拟的练习历史
        session1 = PracticeSession(
            user_id=1,
            category="reading",
            title="Cambridge 18 - Test 2 - Reading",
            total_questions=8,
            correct_count=6,
            time_spent_seconds=3240,  # 54 分钟
            score=7.5
        )
        db.add(session1)
        
        session2 = PracticeSession(
            user_id=1,
            category="listening",
            title="Cambridge 17 - Test 1 - Listening",
            total_questions=40,
            correct_count=32,
            time_spent_seconds=2400,
            score=7.0
        )
        db.add(session2)
        
        db.commit()
        print("示例数据填充完成！")
        
    except Exception as e:
        print(f"填充数据时出错: {e}")
        db.rollback()
    finally:
        db.close()
