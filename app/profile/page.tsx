"use client";

import { useState, useEffect } from "react";
import { readProfile } from "../services/services";
import { camelToEnglish } from "../helpers";

const Profile = () => {
  const [profile, setProfile] = useState<any>();

  const fetchProfile = async () => {
    try {
      const { inferences } = await readProfile();
      console.log(inferences);
      setProfile(inferences);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl">About You:</h2>
      {!profile || Object.keys(profile).length < 1 ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p>There's nothing here.</p>
          <p>Chat with the AI to see helpful data!</p>
        </div>
      ) : (
        <div className="pt-12 pl-8">
          <ul>
            {Object.keys(profile).map((item: any) => {
              return (
                <li key={item} className="py-1">
                  {camelToEnglish(item)}: {profile[item]}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
