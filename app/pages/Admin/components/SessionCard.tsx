// components/SessionCard.tsx

const SessionCard = ({ session }) => {
  return (
    <div className="bg-[rgb(40,25,30)] p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>

      <h3 className="text-white font-medium">{session.name}</h3>
      <p className="text-white text-sm">
        ₹{session.unitPrice}/hour • {session.billedPer}
      </p>
        </div>
      <div>
        <button>Cancel</button>
      </div>
      </div>
    </div>
  );
};

export default SessionCard;