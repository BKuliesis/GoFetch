import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Services.module.css";
import dashboardStyles from "../Dashboard.module.css";
import { IService } from "../../../models/IService";
import { Clock, PoundSterling, SquarePen, Trash2, Plus } from "lucide-react";

function Services() {
    const { user, setUser } = useAuth();
    const [services, setServices] = useState<IService[]>(user.minderRoleInfo.services);

    // const addService = () => {
    //     const updated = [
    //         ...services,
    //         {
    //             id: Date.now(),
    //             type: "New Service",
    //             price: 0,
    //             availability: "Flexible"
    //         }
    //     ];
    //     setServices(updated);

    //     // Update global user context with new services
    //     setUser({
    //         ...user,
    //         minderRoleInfo: {
    //             ...user.minderRoleInfo,
    //             services: updated
    //         }
    //     });
    // };

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (!user) return null;

    return (
        <div className={`${dashboardStyles.dashboardSection}`}>
            <h2>Your Services</h2>
            <p>Manage the services you offer to pet owners.</p>
            <div className={styles.servicesTable}>
                <div className={styles.servicesTableHeader}>
                    <div>Service Type</div>
                    <div>Duration</div>
                    <div>Price</div>
                    <div>Actions</div>
                </div>
                {services.map((service) => (
                    <div key={service.id} className={styles.servicesTableRow}>
                        <div>{capitalize(service.type)}</div>
                        <div><Clock size={16} strokeWidth={2.25} />{service.duration} minutes</div>
                        <div><PoundSterling size={16} strokeWidth={2.25} />{service.price}</div>
                        <div>
                            <button className="btn-round btn-transparent">
                                <SquarePen size={16} strokeWidth={2.25} />
                            </button>
                            <button className="btn-round btn-transparent">
                                <Trash2 size={16} strokeWidth={2.25} />
                            </button>
                        </div>
                    </div>
                ))}

            </div>
            <button className={`btn btn-primary ${styles.addService}`} onClick={() => {}}><Plus size={18} strokeWidth={2.25} />Add New Service</button>
        </div>
    );
}

export default Services;
