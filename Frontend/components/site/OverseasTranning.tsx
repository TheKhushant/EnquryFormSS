// pages/Overseas.tsx
import { useState } from "react";
import Layout from "@/components/site/Layout";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  GlobeAltIcon,
  AcademicCapIcon,
  UserGroupIcon,
  PlayIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  PresentationChartLineIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

// Import flag images
import germanFlag from "/flags/germ.png";
import japaneseFlag from "/flags/japan.png";
import frenchFlag from "/flags/fran.png";
import spanishFlag from "/flags/spain.png";

// Language courses data
const languageCourses = [
  {
    id: "german",
    name: "German",
    flag: germanFlag,
    flagEmoji: "🇩🇪",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "10-15 students",
    description: "Master German language from basics to advanced level with native speakers and interactive sessions.",
    features: [
      "Goethe Institute Curriculum",
      "Exam Preparation (A1-C2)",
      "Conversation Practice",
      "Cultural Immersion"
    ],
    gameAvailable: true,
    gameUrl: "https://learn-gern-play.vercel.app/",
    gameFeatures: ["Flip Cards", "Quiz", "Memory Game"]
  },
  {
    id: "japanese",
    name: "Japanese",
    flag: japaneseFlag,
    flagEmoji: "🇯🇵",
    level: "N5 to N1",
    duration: "14 weeks",
    batchSize: "8-12 students",
    description: "Learn Japanese language with focus on JLPT preparation, kanji mastery, and business communication.",
    features: [
      "JLPT Preparation (N5-N1)",
      "Kanji Mastery Program",
      "Business Japanese",
      "Cultural Workshops"
    ],
    gameAvailable: false
  },
  {
    id: "french",
    name: "French",
    flag: frenchFlag,
    flagEmoji: "🇫🇷",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "10-15 students",
    description: "Parlez-vous français? Master the language of love, diplomacy, and culture with our comprehensive French program.",
    features: [
      "DELF/DALF Preparation",
      "Pronunciation Excellence",
      "French Literature",
      "Cultural Immersion"
    ],
    gameAvailable: false
  },
  {
    id: "spanish",
    name: "Spanish",
    flag: spanishFlag,
    flagEmoji: "🇪🇸",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "12-18 students",
    description: "Learn Spanish, the second most spoken language in the world, with our immersive and practical approach.",
    features: [
      "DELE Preparation",
      "Conversation Mastery",
      "Business Spanish",
      "Hispanic Culture"
    ],
    gameAvailable: false
  }
];

// Benefits of learning with us
const benefits = [
  {
    icon: UserGroupIcon,
    title: "Native Speakers",
    description: "Learn from experienced native language instructors"
  },
  {
    icon: ClockIcon,
    title: "Flexible Batches",
    description: "Weekday and weekend batches to suit your schedule"
  },
  {
    icon: CheckBadgeIcon,
    title: "Certification",
    description: "Globally recognized certificates upon completion"
  },
  {
    icon: PresentationChartLineIcon,
    title: "Career Support",
    description: "Job assistance and placement support"
  }
];

// Neumorphic shadows
const raisedShadow = "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]";
const softHover = "hover:shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff] hover:-translate-y-1";
const insetShadow = "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]";

// Game Card Component
const GameCard = ({ gameUrl, features }: { gameUrl: string; features: string[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className={`relative overflow-hidden rounded-3xl bg-[#e0e5ec] p-6 ${raisedShadow} ${softHover} transition-all duration-300`}
    >
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-2xl bg-[#e0e5ec] ${raisedShadow}`}>
            <PuzzlePieceIcon className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Learn & Play German</h3>
            <p className="text-sm text-gray-600">Interactive Vocabulary Games</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          Master German vocabulary through fun and engaging games. Perfect for beginners and intermediate learners.
        </p>
        
        {/* Game Features */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {features.map((feature) => (
            <div
              key={feature}
              className={`text-center p-3 rounded-xl bg-[#e0e5ec] ${insetShadow}`}
            >
              <span className="text-sm font-medium text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Play Button */}
        <motion.a
          href={gameUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#e0e5ec] text-gray-800 font-semibold rounded-2xl ${raisedShadow} hover:shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff] active:${insetShadow} transition-all duration-300`}
        >
          <PlayIcon className="w-5 h-5" />
          <span>Play Now</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  );
};

// Language Card Component
const LanguageCard = ({ course, index }: { course: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeInUp(index * 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="group relative h-full"
    >
      <div className={`h-full relative rounded-3xl bg-[#e0e5ec] p-6 overflow-hidden transition-all duration-500 ${raisedShadow} ${softHover} flex flex-col`}>
        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Flag Image */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl overflow-hidden ${raisedShadow}`}>
                <img 
                  src={course.flag} 
                  alt={`${course.name} Flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-600">{course.level}</p>
              </div>
            </div>
            <div className="text-3xl">{course.flagEmoji}</div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>
          
          {/* Course Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{course.batchSize}</span>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-2 mb-4 flex-grow">
            {course.features.slice(0, isExpanded ? undefined : 3).map((feature: string) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckBadgeIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* Expand Button */}
          {course.features.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors mb-4 text-left font-medium"
            >
              {isExpanded ? "Show Less" : `+${course.features.length - 3} More Features`}
            </button>
          )}
          
          {/* Game Available Badge */}
          {course.gameAvailable && (
            <div className="mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 bg-[#e0e5ec] rounded-full ${insetShadow}`}>
                <SparklesIcon className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-700">Interactive Games Available</span>
              </div>
            </div>
          )}
          
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-4 py-2.5 rounded-2xl bg-[#e0e5ec] text-gray-800 font-semibold ${raisedShadow} hover:shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff] active:${insetShadow} transition-all duration-300 mt-auto`}
          >
            Enroll Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function OverseasTranning() {
  const germanCourse = languageCourses.find(c => c.id === "german");

  return (
    <Layout>
      <div className="bg-[#e0e5ec]">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-4xl text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0e5ec] mb-6 ${raisedShadow}`}
              >
                <GlobeAltIcon className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-semibold text-gray-700">Overseas Education</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">
                Master Foreign Languages with
                <span className="text-gray-700"> Expert Guidance</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn German, Japanese, French, Spanish and more from native speakers. 
                Prepare for international certifications and unlock global opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Interactive Game Section */}
        {germanCourse && (
          <section className="py-16">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0e5ec] mb-6 ${insetShadow}`}>
                  <SparklesIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Featured Game</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Learn German Through Play
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Make vocabulary learning fun with our interactive games. Perfect for beginners!
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto">
                <GameCard 
                  gameUrl={germanCourse.gameUrl!} 
                  features={germanCourse.gameFeatures!} 
                />
              </div>
            </div>
          </section>
        )}

        {/* Language Courses Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Choose Your Language
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive language programs designed to help you achieve fluency and certification
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {languageCourses.map((course, index) => (
                <LanguageCard key={course.id} course={course} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why Learn With Us?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience world-class language education with unique advantages
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    variants={fadeInUp(index * 0.1)}
                    className={`text-center p-6 rounded-3xl bg-[#e0e5ec] ${raisedShadow} ${softHover} transition-all duration-300`}
                  >
                    <div className={`inline-flex p-3 rounded-2xl bg-[#e0e5ec] text-gray-700 mb-4 ${raisedShadow}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-3xl bg-[#e0e5ec] p-12 text-center ${raisedShadow}`}
            >
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Ready to Start Your Language Journey?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of students who have successfully learned a new language with us
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 bg-[#e0e5ec] text-gray-800 font-bold rounded-2xl ${raisedShadow} hover:shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff] active:${insetShadow} transition-all duration-300`}
                >
                  Book Free Demo Class
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}