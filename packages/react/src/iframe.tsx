import { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

type IFrameProps<T> = Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, 'src'> & {
  message?: T;
  handleMessage: (message: T) => void;
  iframeStyle?: React.CSSProperties;
  children?: React.ReactNode;
};

export const IFrame = <T,>({ message, handleMessage, style, iframeStyle, children, ...props }: IFrameProps<T>) => {
  const [html, setHtml] = useState<string>();
  const [ref, setRef] = useState<HTMLIFrameElement | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const document = ReactDOMServer.renderToStaticMarkup(
      <IFrameContent styles={iframeStyle} handleMessage={handleMessage}>
        {children}
      </IFrameContent>
    );

    setHtml('<!DOCTYPE html>' + document);
  }, [JSON.stringify(iframeStyle)]);

  useEffect(() => {
    if (!ref || !message) {
      return;
    }

    const sendMessage = () => {
      ref.contentWindow?.postMessage(message, '*');
    };

    const onLoaded = () => {
      loaded.current = true;
      sendMessage();
    };

    if (loaded.current) {
      sendMessage();
    } else {
      ref.addEventListener('load', onLoaded);
      return () => ref.removeEventListener('load', onLoaded);
    }
  }, [ref, message]);

  return (
    <iframe
      ref={setRef}
      style={{ width: '100%', height: '100%', ...style }}
      src={'data:text/html;charset=utf-8,' + html}
      {...props}
    />
  );
};

type IFrameContentProps = {
  handleMessage: (message: any) => void;
  styles?: React.CSSProperties;
  children?: React.ReactNode;
};

const IFrameContent = ({ handleMessage, styles, children }: IFrameContentProps) => (
  <html>
    <body style={{ margin: 0, ...styles }}>
      {children}
      <script>{escape(script(handleMessage))}</script>
    </body>
  </html>
);

const script = (handleMessage: (message: unknown) => void) => `
window.addEventListener('message', (event) => {
  (${handleMessage})(event.data);
})
`;
