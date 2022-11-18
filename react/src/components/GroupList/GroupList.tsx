import style from './GroupList.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { chatState, globalState } from '../../redux/store';
import { useContext, useEffect, useState } from 'react';
import { WsConnection } from '../../App';
import {
  toStr,
  convertTime,
  cutMessageText,
} from '../../helpers/auxiliaryFunc';
import { Group } from '../../helpers/types';

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from 'react-bootstrap/Badge';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Loading from '../Utilities/Loading';

interface Props {
  setBarOpen: Function;
}

// A component that creates the user's group list:
function GroupList({ setBarOpen }: Props) {
  const connection = useContext<WebSocket>(WsConnection);
  const groupList = useSelector((state: chatState) => state.chat.groupList);
  const user = useSelector((state: globalState) => state.global.user);
  const group = useSelector((state: chatState) => state.chat.currentGroup);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const openChat = (groupClicked: Group) => {
    if (group && group.group_id === groupClicked.group_id) return;
    setLoading(true);
    connection.send(
      toStr({
        type: 'getGroupMessages',
        groupId: groupClicked.group_id,
        userName: user?.user_name,
        groupName: groupClicked.group_name,
      })
    );
    navigate('/main/' + groupClicked.group_id);
  };

  useEffect(() => {
    setLoading(false);
  }, [group]);

  const backgroundColor = (groupVar: Group): React.CSSProperties => {
    const condition = groupVar.group_id === group?.group_id;
    return { backgroundColor: condition ? '#2a3942' : '#202c33' };
  };

  const wasReadColor = (group: Group): React.CSSProperties => {
    return { color: group.row_to_json.was_read ? '#4fc3f7' : '#beb8ae' };
  };

  return (
    <div className={style.container}>
      {loading && <Loading />}
      <List
        className={style.list}
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      >
        {groupList &&
          groupList.map((groupVar, index) => {
            return (
              <div key={index}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => {
                    openChat(groupVar);
                    setBarOpen(false);
                  }}
                  className={style.item}
                  style={backgroundColor(groupVar)}
                >
                  <ListItemAvatar>
                    <Avatar
                      className={style.image}
                      alt="image"
                      src="https://services.prod.bcomo.com/GetResource?namespace=resourceGroup_6933&resourceId=phoenix_icon_fbFace64&version=0"
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <div className={style.space_between}>
                        {groupVar.group_name}
                        <Typography
                          sx={{ textAlignLast: 'right' }}
                          alignItems="flex-end"
                          component="span"
                          variant="body2"
                          color="#beb8ae"
                        >
                          {groupVar.last_message > 0
                            ? convertTime(groupVar.row_to_json.created_at)
                            : ''}
                        </Typography>
                      </div>
                    }
                    secondary={
                      <span className={style.space_between}>
                        <span>
                          <Typography
                            key={1}
                            sx={{ textAlignLast: 'right' }}
                            alignItems="flex-end"
                            component="span"
                            variant="body2"
                            color="#beb8ae"
                          >
                            {groupVar.last_message > 0 ? (
                              <span>
                                <span>
                                  <DoneAllIcon
                                    style={wasReadColor(groupVar)}
                                    fontSize={'inherit'}
                                  ></DoneAllIcon>
                                  <span> </span>
                                </span>
                                {groupVar.row_to_json.sent_by_name}
                              </span>
                            ) : (
                              '-'
                            )}
                          </Typography>

                          <Typography
                            key={2}
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="#beb8ae"
                          >
                            {groupVar.last_message > 0
                              ? cutMessageText(groupVar)
                              : 'no messages'}
                          </Typography>
                        </span>
                        <span>
                          {groupVar.not_read > 0 && (
                            <Badge className={style.badge} bg="primary">
                              {groupVar.not_read}
                            </Badge>
                          )}
                        </span>
                      </span>
                    }
                  />
                </ListItem>
              </div>
            );
          })}
      </List>
    </div>
  );
}

export default GroupList;
