import React, { useContext } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components/macro";

import { FiltersContext } from "../globalState";
import useDebounce from "../hooks/useDebounce";

import Project from "./Project";
import RoleOverview from "./RoleOverview";

export const PROJECTS_QUERY = gql`
  query projectsQuery {
    projects {
      id
      name
      program
      expireDate
      tasks {
        roleID
        role
        hoursScoped
      }
      hours {
        roleID
        role
        hoursLogged
      }
    }
  }
`;

const Message = styled.div`
  padding: 1.25em 4.2667%;
`;
const MainContainer = styled.main`
  width: 100%;
  padding: 0 4.2667% 3.5em;

  & > * + * {
    margin-top: 2em;
  }
`;

const ProjectsList = () => {
  const { loading, error, data } = useQuery(PROJECTS_QUERY);
  const [
    { clientFilter, programFilter, roleFilter, searchFilter, setFilteredCount }
    // dispatch
  ] = useContext(FiltersContext);

  const loadingLabel = useDebounce("Retrieving Projects...", 1000);

  // get list of projects by role
  const getProjectsByRole = (data, role) =>
    role
      ? data.filter(project => project.tasks.some(task => task.role === role))
      : data;

  const filterProjects = projects =>
    projects
      // filter by client
      .filter(project => project.name.includes(clientFilter))
      // filter by project name
      .filter(project =>
        project.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
      // filter by program
      .filter(project =>
        programFilter ? project.program.includes(programFilter) : project
      )
      // sort projects by name alphabetically
      .sort((a, b) => (a.name > b.name ? -1 : 1))
      // sort projects by expiration: closest to furthest
      .sort((a, b) => (a.expireDate > b.expireDate ? 1 : -1));

  if (loading) return <Message>{loadingLabel}</Message>;
  if (error) return <Message>{error.message}</Message>;
  if (!data || !data.projects) return <Message>No projects found</Message>;

  setFilteredCount(
    getProjectsByRole(filterProjects(data.projects), roleFilter).length
  );

  return (
    <>
      <MainContainer>
        {roleFilter ? (
          <RoleOverview
            projects={getProjectsByRole(
              filterProjects(data.projects),
              roleFilter
            )}
          />
        ) : (
          filterProjects(data.projects).map(project => (
            <Project key={project.id} project={project} />
          ))
        )}
      </MainContainer>
    </>
  );
};

export default ProjectsList;
