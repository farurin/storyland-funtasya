import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMissions, claimMission } from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

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
      <div className="text-center py-20 text-purple-600 font-bold animate-pulse text-sm md:text-base">
        Memuat Misi...
      </div>
    );
  }

  const topBarPercentage = Math.min((missionPoints / 100) * 94, 94);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in px-2 md:px-0">
      {/* PROGRESS BAR ATAS */}
      <div className="relative w-full pt-4 pb-10 md:pt-6 md:pb-12 px-2 md:px-6 mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
        <div className="min-w-150">
          <div className="absolute top-[35%] md:top-[40%] left-[3%] right-[3%] h-4 md:h-8 bg-[#EAE8F0] -translate-y-1/2 z-0 rounded-full"></div>
          <div
            className="absolute top-[35%] md:top-[40%] left-[3%] h-4 md:h-8 bg-[#00D166] -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
            style={{ width: `${topBarPercentage}%` }}
          ></div>
          <div className="relative z-10 flex justify-between items-end w-full px-2">
            <div className="flex flex-col items-center pb-1">
              <IconMedalRibbon />
              <span className="font-extrabold mt-2 text-sm md:text-xl text-black">
                0
              </span>
            </div>
            {[20, 40, 60, 80].map((val) => (
              <div key={val} className="flex flex-col items-center">
                <div
                  className={`transition-transform duration-500 ${
                    missionPoints >= val ? "scale-110" : "opacity-70"
                  }`}
                >
                  <div className="scale-75 md:scale-100 origin-bottom">
                    <IconGift size={44} />
                  </div>
                </div>
                <span className="font-extrabold mt-1 md:mt-2 text-sm md:text-xl text-black">
                  {val}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center">
              <div
                className={`transition-transform duration-500 ${
                  missionPoints >= 100 ? "scale-110" : "opacity-70"
                }`}
              >
                <div className="scale-75 md:scale-100 origin-bottom">
                  <IconGift size={64} />
                </div>
              </div>
              <span className="font-extrabold mt-0 md:mt-1 text-sm md:text-xl text-black">
                100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DAFTAR MISI */}
      <div className="flex flex-col gap-4 md:gap-6">
        {missions.length > 0 ? (
          missions.map((mission) => {
            const progressPercentage =
              (mission.progress / mission.maxProgress) * 100;
            const canClaim =
              mission.progress >= mission.maxProgress && !mission.isClaimed;

            return (
              <div
                key={mission.id}
                className="bg-[#F8F7FF] rounded-3xl md:rounded-4xl p-5 md:p-8 flex flex-col md:flex-row items-center gap-5 md:gap-6 shadow-sm border border-gray-100 transition-transform hover:scale-[1.01]"
              >
                {/* BAGIAN KIRI: Info & Progress Bar Misi */}
                <div className="flex-1 w-full">
                  <h3 className="text-lg md:text-2xl font-extrabold text-black leading-tight">
                    {mission.title}
                  </h3>
                  <p className="text-[11px] md:text-base text-gray-800 font-medium mt-1 mb-3 md:mb-4">
                    {mission.desc}
                  </p>
                  <div className="w-full max-w-md h-4 md:h-6 bg-white border border-gray-200 rounded-full relative overflow-hidden shadow-inner">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#00D166] transition-all duration-1000"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-sm font-bold text-black mix-blend-difference drop-shadow-md tracking-wider">
                      {mission.isClaimed || progressPercentage >= 100
                        ? "Selesai"
                        : `${mission.progress}/${mission.maxProgress}`}
                    </div>
                  </div>
                </div>

                {/* BAGIAN KANAN: Badge, Poin, & Tombol Action */}
                <div className="flex flex-row items-center justify-between w-full md:w-auto md:gap-6 border-t md:border-t-0 md:border-l-[3px] border-[#E2DDFE] pt-4 md:pt-0 md:pl-8 shrink-0">
                  {/* Badge & Poin */}
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="w-12 h-12 md:w-20 md:h-20 shrink-0 drop-shadow-sm hover:scale-105 transition-transform">
                      <img
                        // helper untuk badgeImg
                        src={getImageUrl(mission.badgeImg)}
                        alt="Badge"
                        className="w-full h-full object-contain"
                        onError={(e) =>
                          (e.target.src = `https://ui-avatars.com/api/?name=Badge&background=A898FF&color=fff`)
                        }
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <IconSmallMedal />
                      <span className="font-extrabold text-xs md:text-base text-gray-900 mt-0.5 md:mt-1">
                        +{mission.rewardPoints}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Claim */}
                  <div className="shrink-0">
                    {mission.isClaimed ? (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-500 px-5 md:px-10 py-2.5 md:py-3 rounded-xl font-bold text-[11px] md:text-base cursor-not-allowed"
                      >
                        Selesai
                      </button>
                    ) : canClaim ? (
                      <button
                        onClick={() => handleClaim(mission.id)}
                        className="bg-[#00D166] text-white px-5 md:px-10 py-2.5 md:py-3 rounded-xl font-bold text-[11px] md:text-base hover:bg-green-500 hover:scale-105 transition shadow-md"
                      >
                        Ambil
                      </button>
                    ) : (
                      <button className="bg-[#C0B4FE] text-gray-900 px-5 md:px-10 py-2.5 md:py-3 rounded-xl font-bold text-[11px] md:text-base hover:bg-purple-300 hover:scale-105 transition shadow-sm">
                        Mulai
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 font-medium py-10 text-sm md:text-base">
            Belum ada misi yang tersedia saat ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileMission;
