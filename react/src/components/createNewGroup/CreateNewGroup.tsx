import style from './CreateNewGroup.module.scss';
import { useContext, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import { WsConnection } from '../../App';
import { toStr } from '../../assets/auxiliaryFunc';
import { useSelector } from 'react-redux';
import { globalState } from '../../redux/store';
import { User } from '../../assets/types';

interface Props {
  openNew: Function;
  user: User;
}

function CreateNewGroup({ openNew, user }: Props) {
  const connection = useContext<WebSocket>(WsConnection);
  const message = useSelector((state: globalState) => state.global.message);

  const [groupName, setGroupName] = useState<string>('');
  const [member, setMember] = useState<string>('');
  const [members, setMembers] = useState<string[]>([]);

  const AddMember = () => {
    if (member === '') return;
    setMembers((members) => [...members, member]);
    setMember('');
  };

  const removeMember = (name: string) => {
    setMembers((members) =>
      members.filter((value) => {
        if (value !== name) return value;
      })
    );
  };

  const groupNameError = () => {
    return (
      message.type === 'error' &&
      message.problem === 'createNewGroup' &&
      message.title === 'groupName'
    );
  };

  const submitNewGroupForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (members.length !== 0) {
      connection.send(
        toStr({
          type: 'createNewGroup',
          userName: user.user_name,
          userId: user.user_id,
          groupName: groupName,
          members: members,
        })
      );
    }
  };

  return (
    <div className={style.main_container}>
      <Form onSubmit={(e) => submitNewGroupForm(e)}>
        <Form.Group className="mb-3">
          <Form.Label>group</Form.Label>
          <Form.Control
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
            type="text"
            placeholder="group name"
            required
          />
          {groupNameError() && (
            <Form.Text className="text-muted">
              This group name already exists in the system! try another name.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>member</Form.Label>
          <Form.Control
            onChange={(e) => setMember(e.target.value)}
            value={member}
            type="text"
            placeholder="member name"
          />
          Members:
          <div>
            {members.map((name, index) => {
              return (
                <button
                  className={style.memberBtn}
                  onClick={() => removeMember(name)}
                  key={index}
                >
                  {name}
                </button>
              );
            })}
          </div>
          {message.type === 'error' &&
            message.problem === 'createNewGroup' &&
            Array.isArray(message.title) && (
              <Form.Text className="text-muted">
                {message.title.map((member, index) => {
                  return <span key={index}>'{member}', </span>;
                })}
                <div>
                  <div>These users do not exist in the system!</div>
                  <div>Click on these users to remove them.</div>
                </div>
              </Form.Text>
            )}
          {message.type === 'error' &&
            message.problem === 'createNewGroup' &&
            message.title === 'check members failed' && (
              <Form.Text className="text-muted">
                <div>{message.title}</div>
              </Form.Text>
            )}
          <br></br>
          <button type="button" onClick={() => AddMember()}>
            Add
          </button>
          {message.type === 'error' &&
            message.problem === 'createNewGroup' &&
            message.title === 'failed' && (
              <Form.Text className="text-muted">
                'Create new group' failed, try again....
              </Form.Text>
            )}
        </Form.Group>
        <button type="submit">Submit</button>
        <button onClick={() => openNew(false)}>close</button>
      </Form>
    </div>
  );
}

export default CreateNewGroup;
