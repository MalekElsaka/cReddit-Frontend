import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading/Loading';
import { getRequest } from '../services/Requests';
import { baseUrl } from '../constants';

const VerifyEmail = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await getRequest(`${baseUrl}/user/verify/${token}`, {});
                if (response.status === 200) {
                    navigate('/');
                } else {
                    console.error('Failed to verify email:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error verifying email:', error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [navigate]);

    return (
        <div>
            {isLoading ? <Loading /> : (
                <div>
                    {/**/}
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;
