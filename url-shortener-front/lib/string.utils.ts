interface TruncatedTextProps {
  text: string;
  maxLength: number;
}

export function TruncatedText({ text, maxLength }: TruncatedTextProps) {
  try {
    const truncated =
      text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    return truncated;
  } catch (e: any) {
    console.log(e.message);
    return text;
  }
}
