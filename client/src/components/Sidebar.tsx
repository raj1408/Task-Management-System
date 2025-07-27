import Image from "next/image";
import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const tabs = ["Dashboard", "Tasks", "Profile"];
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <aside className="bg-slate-900 text-white w-64 p-6 min-h-screen flex flex-col">
      <div className="flex flex-col items-center mb-10">
        <Image
          width={1000}
          height={1000}
          src="/images/man-cartoon-characters-using-phone.webp"
          alt="profile"
          className="rounded-full mb-2 w-[80px] h-[80px] object-cover border-2 border-emerald-400"
        />
        <h2 className="text-lg font-semibold">Hello, Raj</h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-4">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left hover:text-emerald-400 ${
                  activeTab === tab ? "text-emerald-400 font-semibold" : ""
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button className="mt-auto bg-emerald-500 px-4 py-2 rounded hover:bg-emerald-600">
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
