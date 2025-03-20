export type EngagementType = 'like' | 'dislike' | 'useful' | 'interesting' | 'no_opinion';
export type ActionType = 'delete' | 'insert';

export const engage = async (
    action: ActionType,
    type: EngagementType,
    source: string,
    id: number,
    engageApi: (source: string, type: EngagementType, action: ActionType, id: number) => Promise<any>,
    setIsLiked: (isLiked: boolean) => void,
    setIsDisliked: (isDisliked: boolean) => void,
    likeCounts: number,
    setLikeCounts: (count: number) => void,
    dislikeCounts: number,
    setDislikeCounts: (count: number) => void,
) => {
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
            else if(['useful', 'interesting', 'no_opinion'].includes(type)){
                // do nothing
            }
        } else {
            console.error('Unexpected response status:', data?.status);
        }
    } catch (error) {
        console.error('Engagement action failed:', error);
    }
};


export const handleBoard = (
    removeFromBoard: boolean,
    showAddToBoardModal: () => void,
    removeFromBoardApi: (action: ActionType) => Promise<void>
) => {
    if (removeFromBoard) return removeFromBoardApi('delete');
    return showAddToBoardModal()
};

export const removeFromBoardApi = async (
    action: ActionType,
    boardId: number,
    id: number,
    source: string,
    pin: (source: string, action: ActionType, boardId: number, id: number) => Promise<any>,
    showNotification: (message : string, submessage: string, messageType: string ) => void,
    redirectUser: () => void,
) => {

    let platform = source;
    if(['news', 'blog', 'publications', 'press release'].includes(source)) platform = 'blog'

    if (!boardId) return;

    try {
        const data = await pin(platform, action, boardId, id);
        if (data?.status === 200) {
            showNotification(
                '',
                'Successfully removed item from board.',
                'success'
            );
            redirectUser();
        } else {
            console.error('Unexpected response status:', data?.status);
            throw new Error();
        }
    } catch (error) {
        console.error('Remove from board action failed:', error);
        showNotification(
            '',
            'Error occurred while removing item from board.',
            'success'
        );
    }
};
