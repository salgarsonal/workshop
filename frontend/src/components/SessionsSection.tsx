import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSessions } from '../services/api';

interface Speaker {
  id: string;
  name: string;
  bio: string;
  photoUrl?: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  time: string;
  speakers: Speaker[];
}

function SessionsSection() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getSessions();
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <section id="sessions" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sessions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sessions & Speakers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our exciting lineup of AI workshops and expert speakers
          </p>
        </motion.div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No sessions available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card"
              >
                <div className="mb-4">
                  <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                    {session.time}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{session.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">{session.description}</p>
                
                {session.speakers && session.speakers.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Speakers:</p>
                    <div className="space-y-2">
                      {session.speakers.map((speaker) => (
                        <div key={speaker.id} className="flex items-center gap-3">
                          {speaker.photoUrl ? (
                            <img
                              src={speaker.photoUrl}
                              alt={speaker.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center">
                              <span className="text-primary-700 font-semibold">
                                {speaker.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{speaker.name}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">{speaker.bio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SessionsSection;

