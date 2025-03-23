import React, { useEffect, useState } from "react";
import { getUserById } from "../../services/Registry";
import { IUser } from "../../models/IUser";
import styles from "./MinderCard.module.css";


interface MinderCardProps {
  minderId: number;
}

const MinderCard: React.FC<MinderCardProps> = ({ minderId }) => {
  const [minder, setMinder] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchMinder = async () => {
      try {
        const fetched = await getUserById(minderId);
        if (fetched) setMinder(fetched);
      } catch (error) {
        console.error("Failed to fetch minder:", error);
      }
    };

    fetchMinder();
  }, [minderId]);

  if (!minder) return null;

  return (
    <div className={styles.card}>
      <h1 className={styles.name}>
        {minder.userDetails?.fname || "Pet Minder"}
      </h1>

      <div className="minder-image">
        <img
          src={
            minder.minderRoleInfo && minder.minderRoleInfo.pictures?.length > 0
              ? `/images/user_images/${minder.minderRoleInfo.pictures[0]}`
              : "/images/user_images/default-profile.png"
          }
          alt={minder.userDetails.fname}
          width="400"
        />
      </div>

      <p className={styles.bio}>
        Lifelong pet lover and certified dog trainer.
      </p>

      <div className={styles.infoLine}>
        🗓️ <strong>Availability:</strong> {minder.minderRoleInfo?.availability || "N/A"}
      </div>

      <div className={styles.infoLine}>
        <strong>📏 Range:</strong> {minder.minderRoleInfo?.distanceRange} miles
      </div>

      <div className={styles.infoLine}>
        ✅ <strong>Verified:</strong> {minder.minderRoleInfo?.verified ? "Yes" : "No"}
      </div>
    </div>
  );
};

export default MinderCard;