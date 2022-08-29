import style from './CreateNewGroup.module.scss';
import { useContext, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import { WsConnection } from '../../App';
import { toStr } from '../../assets/auxiliaryFunc';

interface Props {
  openNew: Function;
  userName: string | undefined;
}

function CreateNewGroup({ openNew, userName }: Props) {
  const connection = useContext<WebSocket>(WsConnection);

  const [groupName, setGroupName] = useState<string>('');
  const [member, setMember] = useState<string>('');

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    connection.send(
      toStr({
        type: 'createNewGroup',
        userName: userName,
        groupName: groupName,
        member: member,
      })
    );
  };

  return (
    <div className={style.container}>
      <Form onSubmit={(e) => submitForm(e)}>
        <Form.Group className="mb-3">
          <Form.Label>group</Form.Label>
          <Form.Control
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
            type="text"
            placeholder="group name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>member</Form.Label>
          <Form.Control
            onChange={(e) => setMember(e.target.value)}
            value={member}
            type="text"
            placeholder="member name"
            required
          />
        </Form.Group>
        <button type="submit">Submit</button>
        <button onClick={() => openNew(false)}>close</button>
      </Form>
    </div>
  );
}

export default CreateNewGroup;
