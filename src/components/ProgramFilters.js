import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { FiltersContext } from "../globalState";
import { useStatusDelay } from "../hooks/statusDelay";

import { Button } from "./globalStyles";

const PROGRAMS_QUERY = gql`
  query programsQuery {
    projects {
      program
    }
  }
`;

const ProgramFilters = () => {
  const { data, loading, error } = useQuery(PROGRAMS_QUERY);
  const { filterProgram, setFilterProgram } = useContext(FiltersContext);
  const loadingLabel = useStatusDelay("Gathering Programs...");

  if (loading)
    return (
      <span>
        <small>{loadingLabel}</small>
      </span>
    );
  if (error)
    return (
      <span>
        <small>{error.message}</small>
      </span>
    );
  if (!data || !data.projects)
    return (
      <span>
        <small>No programs found</small>
      </span>
    );

  const programs = data.projects
    .filter(project => project.program)
    .map(project => project.program)
    .reduce((acc, cur) => {
      if (acc.indexOf(cur) === -1) {
        acc.push(cur);
      }
      return acc;
    }, [])
    .sort();

  return (
    <span>
      {programs.map((program, index) => (
        <Button
          type="button"
          key={index}
          name="program"
          value={program}
          className={filterProgram === program && "active"}
          onClick={e => {
            filterProgram !== program
              ? setFilterProgram(e.currentTarget.value)
              : setFilterProgram("");
          }}
        >
          {program}
        </Button>
      ))}
    </span>
  );
};

export default ProgramFilters;