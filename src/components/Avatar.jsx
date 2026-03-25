import { getMember } from '../data/mockData';

export default function Avatar({ userId, size = 'md', showName = false }) {
  const member = getMember(userId);
  if (!member) return null;

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
        style={{ backgroundColor: member.color }}
        title={member.name}
      >
        {member.avatar}
      </div>
      {showName && (
        <span className="text-sm text-gray-800 font-semibold">{member.name}</span>
      )}
    </div>
  );
}

export function AvatarGroup({ userIds, max = 4, size = 'sm' }) {
  const shown = userIds.slice(0, max);
  const extra = userIds.length - max;

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
  };

  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map(uid => {
        const m = getMember(uid);
        if (!m) return null;
        return (
          <div
            key={uid}
            className={`${sizeClasses[size]} rounded-full border-2 border-white flex items-center justify-center font-bold text-white flex-shrink-0`}
            style={{ backgroundColor: m.color }}
            title={m.name}
          >
            {m.avatar}
          </div>
        );
      })}
      {extra > 0 && (
        <div className={`${sizeClasses[size]} rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-green-700 font-bold text-[10px]`}>
          +{extra}
        </div>
      )}
    </div>
  );
}
