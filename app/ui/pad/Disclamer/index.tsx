import React from 'react';

type Platform = 'action plan' | 'experiment' | 'solution';

export default function Disclaimer({ platform }: { platform: Platform }) {
    const disclaimers: Record<Platform, string> = {
        'action plan': 'Please be aware that the content herein has not been peer reviewed. It consists of personal reflections, insights, and learnings of the contributor(s). It may not be exhaustive, nor does it aim to be authoritative knowledge.',
        'experiment': 'Please be aware that the content herein has not been peer reviewed. It consists of personal reflections, insights, and learnings of the contributor(s). It may not be exhaustive, nor does it aim to be authoritative knowledge.',
        'solution': 'Please be aware that the content herein is comprised of personal reflections, observations, and insights from our contributors. It is not necessarily exhaustive or authoritative, but rather reflects individual perspectives. While we aim for accuracy, we cannot guarantee the completeness or up-to-date nature of the content.',
    };

    return (
        <>  
            <h4>Disclaimer:</h4>
            <p className="">{disclaimers[platform]}</p>
        </>
    );
}
