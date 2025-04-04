import { useEffect, useState } from "react";
import api from "../../shared/hooks/api";

export default function Transactions() {
  const { data: permittedSessions } = api.usePermitedSession();
  const { data: sessions } = api.useSessionsList();

  const [sessionList, setSessionList] = useState([]);
  const [expandedSessions, setExpandedSessions] = useState({}); // Object to track expanded states

  useEffect(() => {
    if (sessions) {
      setSessionList(sessions);
    }
  }, [sessions]);

  const findUnitPrice = (sessionId) => {
    const session = sessionList.find((s) => Number(s.id) === Number(sessionId));
    return session ? session.unitPrice : 0;
  };

  const calculateTotal = (session) => {
    return session?.sessionIds?.reduce((sum, detail) => {
      const matchingSession = sessions?.find((s) => Number(s.id) === Number(detail.sessionId));
      if (matchingSession) {
        sum += matchingSession.unitPrice * detail.quantity;
      }
      return sum;
    }, 0);
  };

  const findSessionName = (sessionId) => {
    const session = sessions?.find((s) => Number(s.id) === Number(sessionId));
    return session ? session.name : "";
  };

  // Toggle function for individual session
  const handleExpand = (index) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle only the clicked index
    }));
  };

  return (
    <section className="p-page pt-5 flex flex-col items-center">
      {permittedSessions?.map((session, index) => (
        <article
          key={index}
          className="px-4 py-2 border rounded-2xl flex flex-col justify-between w-full mb-4"
        >
          <header className="flex justify-between items-center mb-2">
            <h2 className="font-medium text-xl">{session.createdAt.slice(0,10)}</h2>
            <span className="font-medium text-xl">
              ${calculateTotal(session)} {/* Updated to calculate per session */}
            </span>
          </header>

          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <time>{session?.createdAt.slice(11,-5)}</time>
            <span>{session?.sessionIds?.length} items</span>
          </div>

          <button
            className="text-sm cursor-pointer text-left"
            onClick={() => handleExpand(index)}
            aria-expanded={expandedSessions[index] || false}
          >
            {expandedSessions[index] ? (
              <div className="flex flex-col pt-2">
                <div className="border-b pb-2 uppercase">Tap to Collapse</div>

                {session?.sessionIds?.map((sessionInfo, i) => (
                  <div
                    key={i}
                    className="flex justify-between pt-3 items-center border-b pb-2"
                  >
                    <div className="flex flex-col">
                      <div className="capitalize text-lg">
                        {findSessionName(sessionInfo.sessionId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sessionInfo.quantity} x ${findUnitPrice(sessionInfo.sessionId)}
                      </div>
                    </div>
                    <div className="font-medium text-xl">
                      ${sessionInfo.quantity * findUnitPrice(sessionInfo.sessionId)}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between py-3 items-center">
                  <div className="capitalize text-lg">Total</div>
                  <div className="font-medium text-xl">
                    ${calculateTotal(session)} {/* Updated to calculate per session */}
                  </div>
                </div>
              </div>
            ) : (
              <p className="uppercase">Tap to Expand Details</p>
            )}
          </button>
        </article>
      ))}
    </section>
  );
}
