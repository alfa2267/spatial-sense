import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, CreateProjectDTO, UpdateProjectDTO, ProjectFilters } from '../types/domains/project.types';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../services/api';

interface UseProjectsOptions extends Partial<ProjectFilters> {}

export const useProjects = (filters: UseProjectsOptions = {}) => {
  return useQuery<Project[], Error>({
    queryKey: ['projects', filters],
    queryFn: () => getProjects(filters),
  });
};

export const useProject = (id: string) => {
  return useQuery<Project, Error>({
    queryKey: ['projects', id],
    queryFn: () => getProject(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Project, Error, CreateProjectDTO>({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Project, Error, { id: string; data: UpdateProjectDTO }>({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
