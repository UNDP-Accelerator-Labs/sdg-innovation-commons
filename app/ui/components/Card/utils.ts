type EngagementType = 'like' | 'dislike';
type ActionType = 'delete' | 'insert';

export const engage = async (
    action: ActionType,
    type: EngagementType,
    source: string,
    id: number,
    isLogedIn: boolean,
    engageApi: (source: string, type: EngagementType, action: ActionType, id: number) => Promise<any>,
    setIsLiked: (isLiked: boolean) => void,
    setIsDisliked: (isDisliked: boolean) => void,
    likeCounts: number,
    setLikeCounts: (count: number) => void,
    dislikeCounts: number,
    setDislikeCounts: (count: number) => void,
    handleShowNotification: () => void
) => {
    if (!isLogedIn) return handleShowNotification();
    try {
        const data = await engageApi(source, type, action, id);
        if (data?.status === 200) {
            if (type === 'like') {
                setIsLiked(action === 'insert');
                setLikeCounts(likeCounts + (action === 'insert' ? 1 : -1));
                if (!data.active) {
                    setIsLiked(false);
                    setLikeCounts(likeCounts - 1);
                }
            } else if (type === 'dislike') {
                setIsDisliked(action === 'insert');
                setDislikeCounts(dislikeCounts + (action === 'insert' ? 1 : -1));
                if (!data.active) {
                    setIsDisliked(false);
                    setDislikeCounts(dislikeCounts - 1);
                }
            }
        } else {
            console.error('Unexpected response status:', data?.status);
        }
    } catch (error) {
        console.error('Engagement action failed:', error);
    }
};

export const handleShowNotification = (
    setShowNotification: (show: boolean) => void,
    timeout: number = 3000
) => {
    setShowNotification(true);
    setTimeout(() => {
        setShowNotification(false);
    }, timeout);
};

export const handleBoard = (
    isLogedIn: boolean,
    removeFromBoard: boolean,
    setModalOpen: (isOpen: boolean) => void,
    handleShowNotification: () => void,
    removeFromBoardApi: (action: ActionType) => Promise<void>
) => {
    if (!isLogedIn) return handleShowNotification();
    if (removeFromBoard) return removeFromBoardApi('delete');
    setModalOpen(true);
};

export const redirectUser = (pathname: string) => {
    window.history.replaceState(null, '', pathname);
    window.location.reload();
};

export const removeFromBoardApi = async (
    action: ActionType,
    boardId: number,
    id: number,
    source: string,
    pin: (source: string, action: ActionType, boardId: number, id: number) => Promise<any>,
    setMessage: (message: string) => void,
    setMessageType: (type: 'success' | 'warning') => void,
    setSubMessage: (message: string) => void,
    setShowNotification: (show: boolean) => void,
    redirectUser: () => void,
    setModalOpen: (isOpen: boolean) => void
) => {

    let platform = source;
    if(['news', 'blog', 'publications', 'press release'].includes(source)) platform = 'blog'

    if (!boardId) return;

    try {
        const data = await pin(platform, action, boardId, id);
        if (data?.status === 200) {
            console.log(data)
            setMessage('');
            setMessageType('success');
            setSubMessage('Successfully removed item from board.');
            setShowNotification(true);
            redirectUser();
        } else {
            console.error('Unexpected response status:', data?.status);
            throw new Error();
        }
    } catch (error) {
        console.error('Remove from board action failed:', error);
        setMessage('');
        setMessageType('warning');
        setSubMessage('Error occurred while removing item from board.');
        setShowNotification(true);
    }
    setModalOpen(false);
};
