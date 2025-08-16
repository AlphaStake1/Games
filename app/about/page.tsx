'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StadiumHero from '@/components/StadiumHero';

export default function AboutUsPage() {
  const teamMembers = [
    {
      name: 'Coach B',
      role: 'Head Coach & Narrator',
      avatar: '🏈',
      description:
        'The visionary behind bringing Football Squares to the digital world. A lifelong football enthusiast with decades of experience running physical boards.',
      quote:
        "Football isn't just a game—it's a way to bring people together. That's what we're doing here, one square at a time.",
    },
    {
      name: 'Ref Flags',
      role: 'Game Operations',
      avatar: '🦓',
      description:
        'Like a referee on the field, ensuring fair play and smooth operations. Never misses a call, never misses a score update.',
      quote: 'I keep it fair and square - every play, every game, every time.',
    },
    {
      name: 'Data Dave',
      role: 'Stats & Analytics',
      avatar: '📊',
      description:
        'The numbers guy who lives and breathes statistics. Providing real-time insights and historical data to help you make winning decisions.',
      quote:
        "Numbers don't lie, and I've got all the numbers. Let me show you the winning patterns.",
    },
    {
      name: 'Vicky Cash',
      role: 'Payouts & Security',
      avatar: '💰',
      description:
        'Your trusted treasurer ensuring winners get paid fast and secure. Blockchain verification means your money is always safe with me.',
      quote:
        'When you win, I make sure you get paid - fast, secure, guaranteed.',
    },
    {
      name: 'Max Buzz',
      role: 'Community Manager',
      avatar: '🎉',
      description:
        'The hype man keeping the energy high and the community engaged. From weekly challenges to special events, I bring the excitement.',
      quote:
        "Let's get this party started! Every game is a celebration when we play together!",
    },
    {
      name: 'Coach 101',
      role: 'Player Education',
      avatar: '📚',
      description:
        'Your personal tutor for mastering the game. Breaking down the basics and teaching advanced strategies one lesson at a time.',
      quote: 'Class is in session! Let me teach you how to play like a pro.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Enhanced Stadium Hero Section */}
      <StadiumHero title="Our Story" className="min-h-[700px]" />

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Our Why
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
                </div>

                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
                  <p className="leading-relaxed">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      I&apos;m Coach B.
                    </span>{' '}
                    For years I&apos;ve watched the magic of friends gathering
                    around a football squares board — the anticipation, the
                    cheers, the friendly rivalries.
                  </p>

                  <p className="leading-relaxed">
                    But here&apos;s the thing: not everyone could join in.
                    Distance, timing, trust issues with payment—too many
                    barriers kept people from experiencing this thrill.
                    That&apos;s when I knew we had to do something different.
                  </p>

                  <p className="leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-600">
                    <span className="font-bold">Our mission is simple:</span>{' '}
                    Make the football season more fun and easily shareable with
                    friends, wherever they are.
                  </p>

                  <p className="leading-relaxed">
                    We&apos;ve kept what makes football squares great and
                    improved it: instant payouts, provable fairness, and the
                    ability to play with your crew from anywhere. This
                    isn&apos;t just digitizing the game — it&apos;s reimagining
                    how we connect through football.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Meet the Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Powered by ElizaOS agents, guided by Coach B&apos;s vision
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    {/* Avatar Placeholder */}
                    <div className="mb-4 relative">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-4xl">{member.avatar}</span>
                      </div>
                      {/* Image placeholder for future */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 opacity-0">
                        {/* Placeholder for team member image */}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {member.description}
                      </p>
                      <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <p className="text-sm italic text-gray-500 dark:text-gray-500">
                          &quot;{member.quote}&quot;
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                The principles that guide every decision we make
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: '🤝',
                  title: 'Trust & Transparency',
                  description:
                    'Every game, every transaction, every winner—all verifiable on the blockchain. No hidden algorithms, no black boxes.',
                },
                {
                  icon: '🎯',
                  title: 'Fairness First',
                  description:
                    'Using provably random number generation ensures every player has an equal shot at winning. The game decides, not us.',
                },
                {
                  icon: '⚡',
                  title: 'Speed & Reliability',
                  description:
                    'Instant score updates, 5-minute payouts after game end. We respect your time and your trust.',
                },
                {
                  icon: '🌟',
                  title: 'Community Driven',
                  description:
                    'Built for players, by players. Your feedback shapes our platform, your success is our success.',
                },
              ].map((value, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{value.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
            <p className="text-xl mb-8 opacity-95">
              Be part of the future of football squares. Fair, fast, and fun for
              everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = '/boards')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                size="lg"
              >
                Play Now
              </Button>
              <Button
                onClick={() => (window.location.href = '/how-to-play')}
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                size="lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-gray-50 dark:bg-gray-900 border-4 border-black dark:border-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Get in Touch
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Have questions? Want to share your experience? We&apos;d love
                  to hear from you!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => (window.location.href = '/faq')}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700"
                  >
                    Read FAQs
                  </Button>
                  <Button
                    onClick={() => (window.location.href = '/help')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
