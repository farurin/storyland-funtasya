import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMissions, claimMission } from "../services/api";

// icon svg
const IconGift = ({ size = 40 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M4 10H20V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V10Z"
      fill="#5838E5"
    />
    <rect x="2" y="6" width="20" height="4" rx="1" fill="#6B4EFF" />
    <rect x="11" y="6" width="2" height="16" fill="#F4F3FF" />
    <path d="M12 6C12 6 8.5 1.5 5 4C2.5 5.5 8 8 12 6Z" fill="#6B4EFF" />
    <path d="M12 6C12 6 15.5 1.5 19 4C21.5 5.5 16 8 12 6Z" fill="#6B4EFF" />
  </svg>
);
const IconMedalRibbon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="10" r="8" fill="#00D166" />
    <circle cx="12" cy="10" r="5" fill="#FDECA2" />
    <circle cx="12" cy="10" r="3" fill="#E3B341" />
    <path d="M9 16l-2 6 5-2 5 2-2-6" fill="#FDECA2" />
  </svg>
);
const IconSmallMedal = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" fill="#E3B341" />
    <circle cx="12" cy="12" r="6" fill="#FDECA2" />
    <circle cx="12" cy="12" r="3" fill="#fff" />
  </svg>
);

const ProfileMission = () => {
  const { token } = useAuth();
  const [missions, setMissions] = useState([]);
  const [missionPoints, setMissionPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMissionData = async () => {
    if (!token) return;
    try {
      const data = await getMissions(token);
      setMissions(data.missions);

      const totalClaimedPoints = data.missions.reduce((sum, mission) => {
        return mission.isClaimed ? sum + mission.rewardPoints : sum;
      }, 0);
      setMissionPoints(totalClaimedPoints);
    } catch (error) {
      console.error("Gagal mengambil data misi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionData();
  }, [token]);

  const handleClaim = async (missionId) => {
    try {
      await claimMission(missionId, token);
      fetchMissionData();
    } catch (error) {
      alert(error.message || "Gagal mengambil hadiah.");
      console.error("Error claiming mission:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-purple-600 font-bold animate-pulse">
        Memuat Misi...
      </div>
    );
  }

  const topBarPercentage = Math.min((missionPoints / 100) * 94, 94);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="relative w-full pt-6 pb-12 px-2 md:px-6 mb-8 overflow-x-auto">
        <div className="min-w-150">
          <div className="absolute top-[35%] md:top-[40%] left-[3%] right-[3%] h-6 md:h-8 bg-[#EAE8F0] -translate-y-1/2 z-0 rounded-full"></div>
          <div
            className="absolute top-[35%] md:top-[40%] left-[3%] h-6 md:h-8 bg-[#00D166] -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
            style={{ width: `${topBarPercentage}%` }}
          ></div>
          <div className="relative z-10 flex justify-between items-end w-full px-2">
            <div className="flex flex-col items-center pb-1">
              <IconMedalRibbon />
              <span className="font-extrabold mt-2 text-base md:text-xl text-black">
                0
              </span>
            </div>
            {[20, 40, 60, 80].map((val) => (
              <div key={val} className="flex flex-col items-center">
                <div
                  className={`transition-transform duration-500 ${missionPoints >= val ? "scale-110" : "opacity-70"}`}
                >
                  <IconGift size={44} />
                </div>
                <span className="font-extrabold mt-2 text-base md:text-xl text-black">
                  {val}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center">
              <div
                className={`transition-transform duration-500 ${missionPoints >= 100 ? "scale-110" : "opacity-70"}`}
              >
                <IconGift size={64} />
              </div>
              <span className="font-extrabold mt-1 text-base md:text-xl text-black">
                100
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 md:gap-6">
        {missions.length > 0 ? (
          missions.map((mission) => {
            const progressPercentage =
              (mission.progress / mission.maxProgress) * 100;
            const canClaim =
              mission.progress >= mission.maxProgress && !mission.isClaimed;

            return (
              <div
                key={mission.id}
                className="bg-[#F8F7FF] rounded-4xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-gray-100 transition-transform hover:scale-[1.01]"
              >
                <div className="flex-1 w-full">
                  <h3 className="text-xl md:text-2xl font-extrabold text-black">
                    {mission.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-800 font-medium mt-1 mb-4">
                    {mission.desc}
                  </p>
                  <div className="w-full max-w-md h-5 md:h-6 bg-white border border-gray-200 rounded-full relative overflow-hidden shadow-inner">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#00D166] transition-all duration-1000"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-black mix-blend-difference drop-shadow-md tracking-wider">
                      {mission.isClaimed || progressPercentage >= 100
                        ? "done"
                        : `${mission.progress}/${mission.maxProgress}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l-[3px] border-[#E2DDFE] pt-6 md:pt-0 md:pl-10 shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 drop-shadow-sm hover:scale-105 transition-transform">
                    <img
                      src={mission.badgeImg}
                      alt="Badge"
                      className="w-full h-full object-contain"
                      onError={(e) =>
                        (e.target.src = `https://ui-avatars.com/api/?name=Badge&background=A898FF&color=fff`)
                      }
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <IconSmallMedal />
                    <span className="font-extrabold text-sm md:text-base text-gray-900 mt-1">
                      +{mission.rewardPoints}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 flex justify-end md:pl-4">
                  {mission.isClaimed ? (
                    <button
                      disabled
                      className="w-full md:w-auto bg-gray-300 text-gray-500 px-8 md:px-10 py-3 rounded-xl font-bold text-sm md:text-base cursor-not-allowed"
                    >
                      Selesai
                    </button>
                  ) : canClaim ? (
                    <button
                      onClick={() => handleClaim(mission.id)}
                      className="w-full md:w-auto bg-[#00D166] text-white px-8 md:px-10 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-green-500 hover:scale-105 transition shadow-md"
                    >
                      Ambil
                    </button>
                  ) : (
                    <button className="w-full md:w-auto bg-[#C0B4FE] text-gray-900 px-8 md:px-10 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-purple-300 hover:scale-105 transition shadow-sm">
                      Mulai
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 font-medium py-10">
            Belum ada misi yang tersedia saat ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileMission;
