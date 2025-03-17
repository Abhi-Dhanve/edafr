interface IProps {
  selectedSessions: Array<{ id: number; quantity: number }>;
}

export default function (props: IProps) {
  const { selectedSessions: sessions } = props;

  return (
    <div className="flex flex-col">
      {sessions.map((s, key) => (
        <div key={key}>{s.id}</div>
      ))}
    </div>
  );
}
