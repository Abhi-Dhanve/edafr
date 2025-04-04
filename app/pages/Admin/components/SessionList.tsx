// components/SessionList.tsx

import SessionCard from './SessionCard';
import api from '../../../shared/hooks/api';



const SessionList = () => {

  const {data : sessions = []} = api.useSessionsList();


  return (
    <section className="md:col-span-1 lg:col-span-1">
      <h2 className="text-lg font-semibold text-white mb-4">Sessions</h2>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {sessions.map((session, index) => {
          console.log(session);
        return <SessionCard key={index} session={session} />
        })}
      </div>
    </section>
  );
};

export default SessionList;