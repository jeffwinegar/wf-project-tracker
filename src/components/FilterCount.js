import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { FiltersContext } from "../globalState";

const FilterCount = () => {
  const { data, loading, error } = useQuery(
    gql`
      query {
        projects {
          id
        }
      }
    `
  );
  const { filteredProjectCount } = useContext(FiltersContext);

  let totalProjectsCount = 0;

  if (loading) return <small>Loading...</small>;
  if (error) return <small>{error.message}</small>;
  if (!data || !data.projects) return <small>No projects found</small>;

  totalProjectsCount = data.projects.length;

  return (
    <small>
      {filteredProjectCount} of {totalProjectsCount} projects showing
    </small>
  );
};

export default FilterCount;