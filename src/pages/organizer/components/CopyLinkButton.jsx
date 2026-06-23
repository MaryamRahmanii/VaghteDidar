import React, { useContext } from 'react';
import { UserContext } from '../../users/context/user-context';

const CopyLinkButton = ({ className = '' }) => {
  const { userData } = useContext(UserContext);

  // اگر برگزارکننده هنوز آیدی نداشته باشد، دکمه نمایش داده نمی‌شود
  if (!userData?.public_slug) return null;

  const handleCopy = () => {
    const link = `${window.location.origin}/organizer/${userData.public_slug}`;
    navigator.clipboard.writeText(link);
    alert('✅ لینک پروفایل کپی شد!');
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ${className}`}
    >
      🔗 کپی لینک پروفایل
    </button>
  );
};

export default CopyLinkButton;
