import { MenuItem, Modal } from '@mui/material'
import { useState, useEffect } from 'react';
import styles from './Popup.module.css'
import { getAllDrawingController } from '../../../Controllers/projects/index'
import OutsideClickHandler from 'react-outside-click-handler';
import { Close } from '@mui/icons-material';
import ProfileImage from '../../ProfileImage/Image';
import rebarTasks from '../../../Constants/rebarTasks';
import steelActivities from '../../../Constants/steelActivitys';
import SelectUserInput from '../../../Components/SelectUserInput/index'
import steelConditions from '../../../Constants/steelCondition';

const CreateTaskPopup = ({
  projectId,
  createTaskPopup,
  section,
  sections,
  loading,
  setCreateTaskPopup,
  edit,
  defaultData,
  submit,
  generalOnly,
  members,
  projectData,
}) => {
  const [data, setData] = useState({});
  const [users, setUsers] = useState(members);
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [selectedDrawings, setSelectedDrawings] = useState([]);
  const [selectedActivity, setselectedActivity] = useState(defaultData && defaultData.activity)
  const [selectedSubTask, setselectedSubTask] = useState(defaultData && defaultData.subTask)
  const [selectedTask, setselectedTask] = useState(defaultData && defaultData.task)
  const [selectedMultiUser, setselectedMultiUser] = useState([])
  // editable in-modal, defaults to whatever section the caller opened the
  // popup with - only shown/changeable while creating, not editing (an
  // existing task's section isn't otherwise touched by this form)
  const [taskSection, setTaskSection] = useState(section)


  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedDrawings(selectedOptions);
  };

  const handleClose = () => {
    setselectedActivity('')
    setselectedSubTask('')
    setselectedTask('')
    setCreateTaskPopup(false);
  }
  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const submitData = () => {
    if (projectData.rebar) {
      data.drawing = selectedDrawings.join(',');
    } else {
      const subTasks = steelActivities[data.activity]?.[data.subTask] || [];
      if (subTasks.length === 1 && subTasks[0] === '') data.task = '';
      data.name = (typeof data.task === 'undefined')
        ? `${data.subTask}`
        : `${data.subTask}-${data.task}`;
    }

    if (!edit) {
      selectedMultiUser.forEach(async (user) => {
        const dataToSubmit = defaultData
          ? { ...defaultData, ...data }
          : { ...data, section: taskSection };
        dataToSubmit.assignedTo = user._id
        dataToSubmit.assignedToName = `${user.firstName} ${user.lastName}`
        await submit(dataToSubmit);
      })
    } else {
      const dataToSubmit = defaultData
        ? { ...defaultData, ...data }
        : { ...data, section: taskSection };
      submit(dataToSubmit);
      setData({});
      setIsUserSelected(false);
    }

    // submit(dataToSubmit);
    // setData({});
    // setIsUserSelected(false);
  };

  useEffect(() => {
    setUsers(members);
    getAllDrawingController({ projectId })
      .then((res) => setDrawings(res.data.response.data))
      .catch((err) => console.log(err));

    if (!defaultData) data.priority = 'Relaxed';
    if (defaultData) {
      setIsUserSelected(true)
      setData(defaultData)
      // setselectedActivity(defaultData.activity)
      // setselectedSubTask(defaultData.subTask)
      // setselectedTask(defaultData.task)
    }
  }, []);

  const ConditionLessActivities = ['OTHER-ACTIVITIES', 'GENERAL-MANAGEMENT-ACTIVITIES']

  const searchEmployee = (e) => {
    const val = e.target.value.replace(/\s/g, '').toLowerCase();
    if (val.length > 0) {
      setUsers(
        members.filter((u) =>
          `${u.firstName}${u.lastName}`.toLowerCase().includes(val)
        )
      );
    } else {
      setUsers(members);
    }
  };



  return (
    <Modal open={createTaskPopup} onClose={handleClose}>
      <div className={styles.project_popup}>
        <div className={styles.heading}>
          <h2>{edit ? 'Edit' : 'Create'} Task</h2>
        </div>

        <div className={styles.project_popup_input_wrap} >

          {/* Section - only choosable while creating; editing an existing
              task's section isn't otherwise handled by this form. Comes
              first since it drives which activities/sub tasks are valid */}
          {defaultData === null && sections && (
            <div className={styles.form_group}>
              <label>Section</label>
              <select
                name="taskSection"
                value={taskSection}
                onChange={(e) => {
                  // the Sub Task list is filtered by section (steelConditions),
                  // so a previously chosen activity/sub task/task may no
                  // longer be valid once the section changes - clear the
                  // whole cascade rather than leave a stale, invalid pick
                  setTaskSection(e.target.value)
                  setselectedActivity('')
                  setselectedSubTask('')
                  setselectedTask('')
                  setData((prev) => ({ ...prev, activity: '', subTask: '', task: '' }))
                }}
              >
                {sections.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Non-rebar: Activity / Sub Task / Task */}
          {!projectData.rebar && (
            <>
              {/* Activity */}
              <div className={styles.form_group}>
                <label>Activity</label>
                <select
                  name="activity"
                  onChange={(e) => {
                    handleChange(e);
                    setselectedActivity(e.target.value);
                    setselectedSubTask('');
                    setselectedTask('');
                  }}
                  key={selectedActivity}
                  defaultValue={selectedActivity}
                >
                  <option value="" hidden>Select Activity</option>
                  {Object.keys(steelActivities).map((act) => (
                    <option key={act} value={act}>{act}</option>
                  ))}
                </select>
              </div>

              {/* Sub Task */}
              <div className={styles.form_group}>
                <label>Sub Task</label>
                <select
                  name="subTask"
                  onChange={(e) => {
                    handleChange(e);
                    setselectedSubTask(e.target.value);
                    setselectedTask('');
                  }}
                  key={selectedSubTask}
                  defaultValue={selectedSubTask}
                  disabled={!selectedActivity}
                >
                  <option value="" hidden>
                    {!selectedSubTask ? 'Select Sub Task' : selectedSubTask}
                  </option>

                  {selectedActivity &&
                    <>
                      {ConditionLessActivities.includes(selectedActivity) ? Object.keys(steelActivities[selectedActivity]).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      )) : (
                        steelConditions?.[taskSection]
                          ? Object.keys(steelActivities[selectedActivity] || {}).filter((sub) =>
                            steelConditions[taskSection].includes(sub)
                          )
                          : Object.keys(steelActivities[selectedActivity])
                      ).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </>
                  }
                </select>
              </div>

              {/* Task */}
              <div className={styles.form_group}>
                <label>Task</label>
                <select
                  name="task"
                  onChange={(e) => {
                    handleChange(e);
                    setselectedTask(e.target.value);
                  }}
                  defaultValue={selectedTask}
                  disabled={!selectedSubTask}
                >
                  <option value="" hidden>
                    {!selectedTask ? 'Select Task' : selectedTask}
                  </option>
                  {selectedActivity && selectedSubTask &&
                    (steelActivities[selectedActivity]?.[selectedSubTask] || []).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                </select>
              </div>
            </>
          )}

          {/* Commented out default Task Name input */}
          {/*
        <div className={styles.form_group}>
          <label>Task Name</label>
          <input
            type="text"
            placeholder="Task Name"
            name="name"
            onChange={handleChange}
            defaultValue={defaultData?.name || ''}
          />
        </div>
        */}

          {/* Due Date */}
          {taskSection !== 'Rework' && (
            <div className={styles.form_group}>
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                onChange={handleChange}
                defaultValue={defaultData?.dueDate ? defaultData?.dueDate.slice(0, 10) : null}
              />
            </div>
          )}

          {/* Rebar: Task Name select */}
          {projectData.rebar && rebarTasks[taskSection] && (
            <div className={styles.form_group}>
              <label>Task Name</label>
              <select
                name="name"
                onChange={handleChange}
                defaultValue={defaultData?.name || ''}
              >
                <option hidden>Select Sub Task</option>
                {rebarTasks[taskSection].map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}



          {/* Rebar Job coordination */}
          {projectData.rebar && taskSection === 'Job coordination' && (
            <>
              <div className={styles.form_group}>
                <label>Task Name</label>
                <input
                  type="text"
                  placeholder="Task Name"
                  name="name"
                  onChange={handleChange}
                  defaultValue={defaultData?.name || ''}
                />
              </div>
              <div className={styles.form_group}>
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  onChange={handleChange}
                  defaultValue={defaultData?.dueDate ? defaultData?.dueDate.slice(0, 10) : null}
                />
              </div>
            </>
          )}

          {/* Estimated Hours */}
          {defaultData !== null && (
            <div className={styles.form_group}>
              <label>Completed Hours <span style={{color:'red'}}>(activities will be cleared)</span></label>
              <input
                type="number"
                name="completedHours"
                step="0.01"
                inputMode="decimal"
                min={defaultData?.completedHours > 0 ? 1 : 0}
                onChange={handleChange}
                disabled={defaultData !== null && defaultData?.completedHours == 0}
                defaultValue={defaultData?.completedHours || ''}
              />
            </div>
          )}
          {taskSection !== 'Rework' && (
            <div className={styles.form_group}>
              <label>Estimated Hour</label>
              <input
                type="number"
                name="allocatedHours"
                step="0.01"
                inputMode="decimal"
                onChange={handleChange}
                defaultValue={defaultData?.allocatedHours}
              />
            </div>
          )}

          {/* Priority */}
          <div className={styles.form_group}>
            <label>Priority</label>
            <select
              name="priority"
              onChange={handleChange}
              defaultValue={defaultData?.priority || ''}
            >
              <option value={null} hidden>Select</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {projectData.rebar === false && <div className={styles.form_group}>
            <label>Billable</label>
            <select
              name="billable"
              onChange={handleChange}
              defaultValue={defaultData?.billable || ''}
            >
              <option value={null} hidden>Select Billing</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>}

          {/* Drawing for rebar */}
          {projectData.rebar && generalOnly === undefined && (
            <div className={styles.form_group}>
              <label>Drawing</label>
              <select
                style={{ height: '100px' }}
                name="drawing"
                onChange={handleSelectChange}
                multiple
              >
                <option value="" hidden>Select Drawing</option>
                {drawings.map((draw) => (
                  <option key={draw.name} value={draw.name}>{draw.name}</option>
                ))}
              </select>
            </div>
          )}

          {defaultData === null &&
            <div className={styles.form_group} >
              <SelectUserInput multiSelect={true} returnUser={(data) => setselectedMultiUser(data)} returnRaw={true}
                limitedUsers={users.map((data) => data._id)}
                projectId={projectId}
                deleteUser={() => setselectedMultiUser([])} />
            </div>

          }
{/* 
          {defaultData !== null &&
            <SelectUserInput label={'Cannot Modify'} multiSelect={false} returnUser={(data) => setselectedMultiUser(data)} returnRaw={true}
              defaultData={{ firstName: defaultData?.assignedToName, lastName: '' }}
              limitedUsers={users.map((data) => data._id)}
              deleteUser={() => setselectedMultiUser([])} />
          } */}

          {/* Description */}
          <div style={{ width: "100%" }} className={styles.form_group}>
            <label>Description</label>
            <textarea
              placeholder='Project Description'
              name='description'
              defaultValue={defaultData?.description || ''}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className={styles.last_buttons}>
            {loading && <button>.....</button>}
            {!loading && <button onClick={submitData}>{edit ? 'EDIT' : 'CREATE'}</button>}
            {!loading && <button onClick={handleClose}>CANCEL</button>}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTaskPopup;
