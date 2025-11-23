import {useEffect, useState} from "react";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import {Alert, Box, Button, CircularProgress, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {
  useUpdateSnippetById
} from "../utils/queries.tsx";
import {useFormatSnippet, useGetSnippetById, useShareSnippet} from "../utils/queries.tsx";
import {BugReport, Delete, Download, Save, Share} from "@mui/icons-material";
import {ShareSnippetModal} from "../components/snippet-detail/ShareSnippetModal.tsx";
import {TestSnippetModal} from "../components/snippet-test/TestSnippetModal.tsx";
import {Snippet} from "../utils/snippet.ts";
import {SnippetExecution} from "./SnippetExecution.tsx";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import {queryClient} from "../App.tsx";
import {DeleteConfirmationModal} from "../components/snippet-detail/DeleteConfirmationModal.tsx";
import { interpretSnippet } from "../api/snippet.api";

type SnippetDetailProps = {
  id: string;
  handleCloseModal: () => void;
}

const DownloadButton = ({snippet}: { snippet?: Snippet }) => {
  if (!snippet) return null;
  const file = new Blob([snippet.content], {type: 'text/plain'});

  return (
    <Tooltip title={"Download"}>
      <IconButton sx={{
        cursor: "pointer"
      }}>
        <a download={`${snippet.name}.${snippet.extension}`} target="_blank"
           rel="noreferrer" href={URL.createObjectURL(file)} style={{
          textDecoration: "none",
          color: "inherit",
          display: 'flex',
          alignItems: 'center',
        }}>
          <Download/>
        </a>
      </IconButton>
    </Tooltip>
  )
}

export const SnippetDetail = (props: SnippetDetailProps) => {
  const {id, handleCloseModal} = props;
  const [code, setCode] = useState(
      ""
  );
  const [shareModalOppened, setShareModalOppened] = useState(false)
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false)
  const [testModalOpened, setTestModalOpened] = useState(false);

  // State for interpret inputs and output
  const [interpretInput, setInterpretInput] = useState("");
  const [interpretOutput, setInterpretOutput] = useState<string | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);

  const {data: snippet, isLoading} = useGetSnippetById(id);
  const {mutate: shareSnippet, isLoading: loadingShare} = useShareSnippet()
  const {mutate: formatSnippet, isLoading: isFormatLoading, data: formatSnippetData} = useFormatSnippet()
  const {mutate: updateSnippet, isLoading: isUpdateSnippetLoading} = useUpdateSnippetById({
    onSuccess: () => {
      queryClient.invalidateQueries(['snippet', id]);
      queryClient.invalidateQueries('listSnippets');
      queryClient.invalidateQueries('users');
    }
  });

  useEffect(() => {
    if (snippet) {
      setCode(snippet.content);
    }
  }, [snippet]);

  useEffect(() => {
    if (formatSnippetData) {
      queryClient.invalidateQueries(['snippet', id]);
    }
  }, [formatSnippetData, id])


  async function handleShareSnippet(userId: string) {
    shareSnippet({snippetId: id, userId})
  }

  return (
      <Box p={4} minWidth={'60vw'}>
        <Box width={'100%'} p={2} display={'flex'} justifyContent={'flex-end'}>
          <CloseIcon style={{cursor: "pointer"}} onClick={handleCloseModal}/>
        </Box>
        {
          isLoading ? (<>
            <Typography fontWeight={"bold"} mb={2} variant="h4">Loading...</Typography>
            <CircularProgress/>
          </>) : <>
            <Typography variant="h4" fontWeight={"bold"}>{snippet?.name ?? "Snippet"}</Typography>
            <Box display="flex" flexDirection="row" gap="8px" padding="8px">
              <Tooltip title={"Share"}>
                <IconButton onClick={() => setShareModalOppened(true)}>
                  <Share/>
                </IconButton>
              </Tooltip>
              <Tooltip title={"Test"}>
                <IconButton onClick={() => setTestModalOpened(true)}>
                  <BugReport/>
                </IconButton>
              </Tooltip>
              <DownloadButton snippet={snippet}/>
              {/*<Tooltip title={runSnippet ? "Stop run" : "Run"}>*/}
              {/*  <IconButton onClick={() => setRunSnippet(!runSnippet)}>*/}
              {/*    {runSnippet ? <StopRounded/> : <PlayArrow/>}*/}
              {/*  </IconButton>*/}
              {/*</Tooltip>*/}
              {/* TODO: we can implement a live mode*/}
              <Tooltip title={"Format"}>
                  <IconButton onClick={() => formatSnippet({ snippetId: id, content: code })} disabled={isFormatLoading}>
                      <ReadMoreIcon />
                  </IconButton>

              </Tooltip>
              <Tooltip title={"Save changes"}>
                <IconButton color={"primary"} onClick={() => {
                  console.log('Save button clicked', {id, code, snippetContent: snippet?.content});
                  updateSnippet({id: id, updateSnippet: {content: code}});
                }} disabled={isUpdateSnippetLoading || snippet?.content === code} >
                  <Save />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Delete"}>
                <IconButton onClick={() => setDeleteConfirmationModalOpen(true)} >
                  <Delete color={"error"} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box display={"flex"} gap={2}>
              <Box flex={1} height={"fit-content"} overflow={"none"} minHeight={"500px"} bgcolor={'black'} color={'white'}>
                <Editor
                    value={code}
                    padding={10}
                    onValueChange={(code) => setCode(code)}
                    highlight={(code) => highlight(code, languages.js, "javascript")}
                    maxLength={1000}
                    style={{
                      minHeight: "500px",
                      fontFamily: "monospace",
                      fontSize: 17,
                    }}
                />
                {/* Interpret input and button */}
                <Box mt={2} mb={2} display="flex" gap={2} alignItems="center">
                  <TextField
                    label="Type here (comma-separated)"
                    value={interpretInput}
                    onChange={e => setInterpretInput(e.target.value)}
                    size="small"
                    variant="outlined"
                    sx={{ background: 'white', borderRadius: 1, flex: 1 }}
                  />
                  <Button
                    variant="contained"
                    disabled={isInterpreting || !interpretInput.trim()}
                    onClick={async () => {
                      if (!snippet) return;
                      setIsInterpreting(true);
                      try {
                        const inputs = interpretInput.split(',').map(s => s.trim()).filter(Boolean);
                        const request = {
                          snippetContent: code,
                          version: snippet.version,
                          inputs,
                        };
                        const response = await interpretSnippet(request, id);
                        setInterpretOutput(response.output);
                        console.log("Interpret output:", response.output);
                      } catch (err) {
                        setInterpretOutput("Error interpreting snippet");
                        console.error("Interpret error:", err);
                      } finally {
                        setIsInterpreting(false);
                      }
                    }}
                  >
                    Interpret
                  </Button>
                </Box>
                {interpretOutput && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    Output: {interpretOutput}
                  </Alert>
                )}
              </Box>
            </Box>
            <Box pt={1} flex={1} marginTop={2}>
              <Alert severity="info">Output</Alert>
              <SnippetExecution />
            </Box>
          </>
        }
        <ShareSnippetModal
            loading={loadingShare || isLoading}
            open={shareModalOppened}
            onClose={() => setShareModalOppened(false)}
            onShare={handleShareSnippet}
            snippetId={id} // Agregar esta prop
        />
        <TestSnippetModal open={testModalOpened} onClose={() => setTestModalOpened(false)} snippetId={id}/>
        <DeleteConfirmationModal open={deleteConfirmationModalOpen} onClose={() => setDeleteConfirmationModalOpen(false)} id={snippet?.id ?? ""} setCloseDetails={handleCloseModal} />
      </Box>
  );
}
