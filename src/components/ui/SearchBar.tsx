import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { InputBase, Box, List, ListItem, ListItemButton, ListItemText, Paper, Popper, ClickAwayListener } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  border: '1px solid',
  borderColor: 'divider',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

type SearchResult = {
  id: string;
  title: string;
  type: 'strategy' | 'client' | 'report' | 'device';
};

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock search function - replace with actual API call
  const handleSearch = (term: string) => {
    if (term.trim() === '') {
      setSearchResults([]);
      setOpen(false);
      return;
    }

    // Mock data - replace with actual search logic
    const mockResults = [
      { id: '1', title: 'Retail Automation Strategy', type: 'strategy' as const },
      { id: '2', title: 'Warehouse Client', type: 'client' as const },
      { id: '3', title: 'Q2 2023 Report', type: 'report' as const },
      { id: '4', title: 'Conveyor Belt Device', type: 'device' as const },
    ].filter((item): item is SearchResult => 
      item.title.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(mockResults);
    setOpen(mockResults.length > 0);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to an appropriate route based on result type
    switch (result.type) {
      case 'strategy':
        navigate('/strategy');
        break;
      case 'client':
        navigate('/clients');
        break;
      case 'device':
        navigate('/devices');
        break;
      case 'report':
        // No explicit reports route; send to dashboard as a placeholder
        navigate('/dashboard');
        break;
      default:
        navigate('/');
    }
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 500 }}>
      <Search ref={anchorRef}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => searchTerm.trim() !== '' && setOpen(true)}
        />
      </Search>
      
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        sx={{ zIndex: 1300, width: anchorRef.current?.clientWidth }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={3} sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
            {searchResults.length > 0 ? (
              <List>
                {searchResults.map((result) => (
                  <ListItem key={result.id} disablePadding>
                    <ListItemButton 
                      onClick={() => handleResultClick(result)}
                      sx={{ width: '100%' }}
                    >
                      <ListItemText 
                        primary={result.title} 
                        secondary={result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : searchTerm.trim() !== '' ? (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                No results found
              </Box>
            ) : null}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default SearchBar;
