import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Tooltip,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  FormatQuote as FormatQuoteIcon,
  Title as TitleIcon,
  TextFields as TextFieldsIcon,
} from '@mui/icons-material';

const TemplateEditorPage = () => {
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    category: '',
    content: '<p>Start editing your template here...</p>',
    isActive: true,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize the editor
  useEffect(() => {
    // This would be replaced with your actual editor initialization logic
    console.log('Initializing template editor...');
    
    // Cleanup function
    return () => {
      console.log('Cleaning up template editor...');
    };
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: checked,
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // Save logic would go here
    console.log('Saving template:', template);
    setIsDirty(false);
    // Show success message
  };

  const handlePreview = () => {
    // Preview logic would go here
    console.log('Previewing template:', template);
  };

  // Formatting handlers
  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setTemplate(prev => ({
        ...prev,
        content: editorRef.current?.innerHTML || '',
      }));
      setIsDirty(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Template Editor
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handlePreview}
            sx={{ mr: 1 }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save Template
          </Button>
        </Box>
      </Box>


      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Template Details
              </Typography>
              <TextField
                fullWidth
                label="Template Name"
                name="name"
                value={template.name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={template.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={2}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={template.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="document">Document</MenuItem>
                  <MenuItem value="report">Report</MenuItem>
                  <MenuItem value="proposal">Proposal</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={template.isActive}
                    onChange={handleSwitchChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label={template.isActive ? 'Active' : 'Inactive'}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="template editor tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Edit" />
                    <Tab label="Preview" />
                    <Tab label="HTML" />
                  </Tabs>
                </Box>
                <Box sx={{ p: 2 }}>
                  {activeTab === 0 && (
                    <>
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                        <Tooltip title="Bold">
                          <IconButton onClick={() => formatText('bold')} size="small">
                            <FormatBoldIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Italic">
                          <IconButton onClick={() => formatText('italic')} size="small">
                            <FormatItalicIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Underline">
                          <IconButton onClick={() => formatText('underline')} size="small">
                            <FormatUnderlinedIcon />
                          </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                        <Tooltip title="Bulleted List">
                          <IconButton onClick={() => formatText('insertUnorderedList')} size="small">
                            <FormatListBulletedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Numbered List">
                          <IconButton onClick={() => formatText('insertOrderedList')} size="small">
                            <FormatListNumberedIcon />
                          </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                        <Tooltip title="Insert Link">
                          <IconButton onClick={() => formatText('createLink', prompt('Enter URL:'))} size="small">
                            <LinkIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert Image">
                          <IconButton onClick={() => formatText('insertImage', prompt('Image URL:'))} size="small">
                            <ImageIcon />
                          </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                        <Tooltip title="Code">
                          <IconButton onClick={() => formatText('formatBlock', '<pre>')} size="small">
                            <CodeIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Quote">
                          <IconButton onClick={() => formatText('formatBlock', '<blockquote>')} size="small">
                            <FormatQuoteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box
                        ref={editorRef}
                        contentEditable
                        dangerouslySetInnerHTML={{ __html: template.content }}
                        onInput={(e) => {
                          setTemplate(prev => ({
                            ...prev,
                            content: e.currentTarget.innerHTML,
                          }));
                          setIsDirty(true);
                        }}
                        style={{
                          minHeight: '300px',
                          padding: '16px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          outline: 'none',
                        }}
                      />
                    </>
                  )}
                  {activeTab === 1 && (
                    <Box
                      dangerouslySetInnerHTML={{ __html: template.content }}
                      style={{
                        minHeight: '300px',
                        padding: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    />
                  )}
                  {activeTab === 2 && (
                    <TextField
                      fullWidth
                      multiline
                      rows={10}
                      value={template.content}
                      onChange={(e) => {
                        setTemplate(prev => ({
                          ...prev,
                          content: e.target.value,
                        }));
                        setIsDirty(true);
                      }}
                      variant="outlined"
                      InputProps={{
                        style: {
                          fontFamily: 'monospace',
                          fontSize: '14px',
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TemplateEditorPage;
