import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Groups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Fetch all ImageGenerationGroups
    fetch('/api/groups')
      .then((res) => res.json())
      .then((data) => setGroups(data));
  }, []);

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {groups.map((group) => (
            <Tr key={group.id}>
              <Td>{group.name}</Td>
              <Td>
                <Link href={`/groups/${group.id}`}>Edit</Link>
                {/* Add delete functionality here */}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Link href="/groups/create">
        <Button mt={4}>Create New Group</Button>
      </Link>
    </Box>
  );
};

export default Groups;
