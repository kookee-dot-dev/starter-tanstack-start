import { KookeeChatWidget } from '@kookee/react/chat';
import '@kookee/react/chat.css';

export default function ChatWidget({ apiKey }: { apiKey: string }) {
  return <KookeeChatWidget clientOptions={{ apiKey }} theme="auto" />;
}
