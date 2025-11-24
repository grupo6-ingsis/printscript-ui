import {OutlinedInput, Button} from "@mui/material";
import {useState} from "react";
import {useInterpretSnippet} from "../utils/queries";

export const SnippetExecution = ({snippetId, content, version}: {snippetId: string, content: string, version: string}) => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isLoading } = useInterpretSnippet();

  const handleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && input.trim()) {
      setError(null);
      try {
        const inputs = input.split(",").map(s => s.trim()).filter(Boolean);
        const request = {
          snippetContent: content,
          version,
          inputs,
        };
        const response = await mutateAsync({ request, snippetId });
        if (response.resultType === "FAILURE") {
          setError("Error: " + (response.results?.join("\n") || "Execution failed"));
          setOutput([]);
        } else {
          setError(null);
          setOutput(response.results || []);
        }
      } catch (e) {
        setError("Server error");
        setOutput([]);
      }
      setInput("");
    }
  };

  const handleNoInput = async () => {
    setError(null);
    try {
      const request = {
        snippetContent: content,
        version,
        inputs: [],
      };
      const response = await mutateAsync({ request, snippetId });
      if (response.resultType === "FAILURE") {
        setError("Error: " + (response.results?.join("\n") || "Execution failed"));
        setOutput([]);
      } else {
        setError(null);
        setOutput(response.results || []);
      }
    } catch (e) {
      setError("Server error");
      setOutput([]);
    }
  };

  return (
    <>
      <div style={{background: "black", color: "white", minHeight: 200, padding: 10, fontFamily: "monospace"}}>
        {error && <div style={{color: "#ff5252"}}>{error}</div>}
        {output.map((line, idx) => <div key={idx}>{line}</div>)}
      </div>
      <OutlinedInput
        onKeyDown={handleEnter}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type comma-separated inputs and press Enter"
        fullWidth
        disabled={isLoading}
      />
      <Button
        variant="contained"
        sx={{ mt: 1 }}
        onClick={handleNoInput}
        disabled={isLoading}
      >
        Interpretar sin inputs
      </Button>
    </>
  );
}