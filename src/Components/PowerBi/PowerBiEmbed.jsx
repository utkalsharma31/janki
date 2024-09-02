import React, {useRef, useEffect} from 'react'
import PowerBi from './PowerBi'


const PowerBiEmbed = ({ embedUrl, accessToken, embedId }) => {
    const embedContainer = useRef(null);

    useEffect(() => {
        const embedConfig = {
        type: 'report',   // Use 'dashboard' or 'tile' for embedding dashboards or tiles
        id: embedId,
        embedUrl: embedUrl,
        accessToken: accessToken,
        tokenType: powerbi.models.TokenType.Aad,
        settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false
        }
        };

        const report = powerbi.embed(embedContainer.current, embedConfig);

        return () => {
        report.off("loaded");
        report.off("error");
        };
    }, [embedUrl, accessToken, embedId]);

  return (
    <div ref={embedContainer} style={{ height: '100vh', width: '100%' }}></div>
  )
}

export default PowerBiEmbed