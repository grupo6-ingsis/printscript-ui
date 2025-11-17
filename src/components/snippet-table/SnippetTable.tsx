import {
    Box,
    Button, capitalize,
    FormControl,
    IconButton,
    InputBase,
    InputLabel,
    Menu,
    MenuItem, Select,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import {AddSnippetModal} from "./AddSnippetModal.tsx";
import {useRef, useState} from "react";
import {Add, Search} from "@mui/icons-material";
import {LoadingSnippetRow, SnippetRow} from "./SnippetRow.tsx";
import {CreateSnippetWithLang, getFileLanguage, Snippet, SnippetFilters} from "../../utils/snippet.ts";
import {usePaginationContext} from "../../contexts/paginationContext.tsx";
import {useSnackbarContext} from "../../contexts/snackbarContext.tsx";
import {useGetFileTypes} from "../../utils/queries.tsx";
import {AccessType, DirectionType, SortByType} from "../../types/FilterTypes.ts";

type SnippetTableProps = {
  handleClickSnippet: (id: string) => void;
  snippets?: Snippet[];
  loading: boolean;
  handleSearchSnippet: (snippetName: string) => void;
  filters: SnippetFilters;
  onFilterChange: (filters: Partial<SnippetFilters>) => void;
}

export const SnippetTable = (props: SnippetTableProps) => {
  const {snippets, handleClickSnippet, loading, handleSearchSnippet, filters, onFilterChange} = props;
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [popoverMenuOpened, setPopoverMenuOpened] = useState(false)
  const [snippet, setSnippet] = useState<CreateSnippetWithLang | undefined>()

  const popoverRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {page, page_size: pageSize, count, handleChangePageSize, handleGoToPage} = usePaginationContext()
  const {createSnackbar} = useSnackbarContext()
  const {data: fileTypes} = useGetFileTypes();

    const handleLoadSnippet = async (target: EventTarget & HTMLInputElement) => {
        const files = target.files;
        if (!files || !files.length) {
            createSnackbar('error', "Please select at least one file");
            return;
        }
        const file = files[0];
        const splitName = file.name.split(".");
        const fileType = getFileLanguage(fileTypes ?? [], splitName[splitName.length - 1]);
        if (!fileType) {
            createSnackbar('error', `File type ${splitName[splitName.length - 1]} not supported`);
            return;
        }
        file.text().then((text) => {
            setSnippet({
                name: splitName[0],
                content: text,
                language: fileType.language,
                extension: fileType.extension,
                version: "1.0", // Dejar vacío para que el usuario seleccione en el modal
                description: "" // Descripción vacía o predeterminada
            });
        }).catch(e => {
            console.error(e);
        }).finally(() => {
            setAddModalOpened(true);
            target.value = "";
        });
    };

    function handleClickMenu() {
    setPopoverMenuOpened(false)
  }

  const languages = fileTypes?.map(ft => ft.language) || [];

  return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" gap={2} mb={2}>
          <Box sx={{background: 'white', width: '25%', display: 'flex'}}>
            <InputBase
                sx={{ml: 1, flex: 1}}
                placeholder="Search Snippet"
                inputProps={{'aria-label': 'search'}}
                onChange={e => handleSearchSnippet(e.target.value)}
            />
            <IconButton type="button" sx={{p: '10px'}} aria-label="search">
              <Search/>
            </IconButton>
          </Box>
          
          <Box display="flex" gap={1} flexGrow={1}>
            <FormControl size="small" sx={{ minWidth: 120, background: 'white' }}>
              <InputLabel>Access Type</InputLabel>
              <Select
                value={filters.accessType || 'ALL'}
                label="Access Type"
                onChange={(e) => onFilterChange({ accessType: e.target.value as AccessType })}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="OWNER">Owner</MenuItem>
                <MenuItem value="SHARED">Shared</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120, background: 'white' }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={filters.language || ''}
                label="Language"
                onChange={(e) => onFilterChange({ language: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>{capitalize(lang)}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120, background: 'white' }}>
              <InputLabel>Compliance</InputLabel>
              <Select
                value={filters.passedLint === undefined ? 'all' : filters.passedLint.toString()}
                label="Compliance"
                onChange={(e) => {
                  const value = e.target.value;
                  onFilterChange({ 
                    passedLint: value === 'all' ? undefined : value === 'true' 
                  });
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Passed</MenuItem>
                <MenuItem value="false">Failed</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120, background: 'white' }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy || 'NAME'}
                label="Sort By"
                onChange={(e) => onFilterChange({ sortBy: e.target.value as SortByType })}
              >
                <MenuItem value="NAME">Name</MenuItem>
                <MenuItem value="LANGUAGE">Language</MenuItem>
                <MenuItem value="PASSED_LINT">Compliance</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100, background: 'white' }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={filters.direction || 'DESC'}
                label="Order"
                onChange={(e) => onFilterChange({ direction: e.target.value as DirectionType })}
              >
                <MenuItem value="ASC">ASC</MenuItem>
                <MenuItem value="DESC">DESC</MenuItem>
              </Select>
            </FormControl>
          </Box>

            <Button ref={popoverRef} variant="contained" disableRipple sx={{boxShadow: 0}}
                  onClick={() => setPopoverMenuOpened(true)}>
            <Add/>
            Add Snippet
          </Button>
        </Box>
        <Table size="medium" sx={{borderSpacing: "0 10px", borderCollapse: "separate"}}>
          <TableHead>
            <TableRow sx={{fontWeight: 'bold'}}>
              <StyledTableCell sx={{fontWeight: "bold"}}>Name</StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>Language</StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>Author</StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>Conformance</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{
            loading ? (
                <>
                  {Array.from({length: 10}).map((_, index) => (
                      <LoadingSnippetRow key={index}/>
                  ))}
                </>
            ) : (
                <>
                  {
                      snippets && snippets.map((snippet) => (
                          <SnippetRow data-testid={"snippet-row"}
                                      onClick={() => handleClickSnippet(snippet.id)} key={snippet.id} snippet={snippet}/>
                      ))
                  }
                </>
            )
          }
          </TableBody>
          <TablePagination count={count} page={page} rowsPerPage={pageSize}
                           onPageChange={(_, page) => handleGoToPage(page)}
                           onRowsPerPageChange={e => handleChangePageSize(Number(e.target.value))}/>
        </Table>
        <AddSnippetModal defaultSnippet={snippet} open={addModalOpened}
                         onClose={() => setAddModalOpened(false)}/>
        <Menu anchorEl={popoverRef.current} open={popoverMenuOpened} onClick={handleClickMenu}>
          <MenuItem onClick={() => setAddModalOpened(true)}>Create snippet</MenuItem>
          <MenuItem onClick={() => inputRef?.current?.click()}>Load snippet from file</MenuItem>
        </Menu>
        <input hidden type={"file"} ref={inputRef} multiple={false} data-testid={"upload-file-input"}
               onChange={e => handleLoadSnippet(e?.target)}/>
      </>
  )
}


export const StyledTableCell = styled(TableCell)`
    border: 0;
    align-items: center;
`
