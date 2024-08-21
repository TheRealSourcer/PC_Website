import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useUserUUID = () => {
    const [userUUID, setUserUUID] = useState(null);

    useEffect(() => {
        let id = localStorage.getItem('userUUID');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('userUUID', id);
        }
        setUserUUID(id);
    }, []);

    return userUUID;
};

export default useUserUUID;
