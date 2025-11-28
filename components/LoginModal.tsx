import React, { useState, useEffect } from 'react';


interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [showQrCode, setShowQrCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [customMessage, setCustomMessage] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const handleSetup2FA = async () => {
        setIsSendingEmail(true);
        try {
            const response = await fetch('/api/setup-2fa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: customMessage,
                    whatsapp: whatsapp,
                }),
            });
            const data = await response.json();
            if (response.ok && data.message) {
                setMessage(data.message);
            } else {
                console.error('Failed to send email');
            }
        } catch (err) {
            console.error('Error sending email:', err);
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: otp }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                onLoginSuccess();
                onClose();
                setOtp('');
            } else {
                setError(data.error || 'Código inválido. Tente novamente.');
            }
        } catch (err) {
            console.error(err);
            setError('Erro ao verificar código.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Acesso Administrativo</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Código Google Authenticator
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Digite o código de 6 dígitos"
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verificando...' : 'Entrar'}
                        </button>
                    </div>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={() => setShowQrCode(!showQrCode)}
                        className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                        {showQrCode ? 'Ocultar QR Code de Configuração' : 'Primeiro acesso? Configurar Google Authenticator'}
                    </button>

                    {showQrCode && (
                        <div className="mt-4 flex flex-col items-center space-y-3">
                            {!message ? (
                                <>
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Mensagem (Opcional)
                                        </label>
                                        <textarea
                                            value={customMessage}
                                            onChange={(e) => setCustomMessage(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                            placeholder="Mensagem para o email do admin..."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            WhatsApp (Opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                            placeholder="(92) 99999-9999"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSetup2FA}
                                        disabled={isSendingEmail}
                                        className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        {isSendingEmail ? 'Enviando...' : 'Enviar QR Code para Admin'}
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">{message}</p>

                                    <button
                                        type="button"
                                        onClick={() => setMessage('')}
                                        className="mt-2 text-xs text-blue-600 hover:text-blue-500"
                                    >
                                        Enviar novamente
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
