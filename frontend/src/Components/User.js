import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { AuthStateContext } from '../context/AuthProvider';

const User = () => {
    const [user, setUser] = useState({})
    const { setAuth } = AuthStateContext()

    useEffect(() => {
        let isMounted = true
        const getUser = async () => {
            const controller = new AbortController();

            try {
                const response = await axios.get(
                    '/token',
                    { signal: controller.signal }
                );
                console.log(response.data)
                isMounted && setUser
            }
            catch (error) {
                console.log(error)
            }

        }
    }, [])
    return (
        <span>
            {user['username'] ? user.username : 'anonymous'}
        </span>
    )
}

export default User