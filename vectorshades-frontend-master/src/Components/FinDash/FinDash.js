import { Add, ArrowDropDown, ArrowUpward, AttachFile, Circle, Comment, CreditCard, DriveFolderUpload, KeyboardArrowDown, KeyboardArrowUp, MoreVert, Notifications, Search, Settings } from '@mui/icons-material'
import { Avatar } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../../../styles/FinDash.module.css'

const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

const FinDash = () => {
  return (
    <>
    <div className={styles.findash_container}>
      <div className={styles.fin_top}>
        <div className={styles.top_left} >
         <h2>Hello Steward 👋🏼</h2>
         <div className={styles.choose_account}>
            <h3>Choose Account</h3>
            <div>
                <KeyboardArrowUp style={{fill:"grey"}} />
                <KeyboardArrowDown style={{fill:"grey"}} />
            </div>
         </div>
        </div>
        <div className={styles.top_icons} >
            <div><Search style={{fontSize:"20px"}} /></div>
            <div><Notifications style={{fontSize:"20px"}} /></div>
            <div><Comment style={{fontSize:"20px"}} /></div>
            <div><Settings style={{fontSize:"20px"}} /></div>
        </div>
      </div>
      <div className={styles.fin_bottom} >
        <div className={styles.fin_bottom_left}>
            <div className={styles.my_card}>
                <h3>My Card</h3>
                <div>
                    <h2>$1,43,888.00</h2>
                    <div>
                        <button><CreditCard style={{fill:"white"}} />Deposit</button>
                        <button><CreditCard style={{fill:"#e64848d8"}} />Withdraw</button>
                    </div>
                </div>
            </div>
            <div className={styles.fin_record} >
             <div className={styles.fin_record_top} >
                <h3>Financial Record</h3>
                <div className={styles.dropdown} >Month <ArrowDropDown/></div>
             </div>
             <div className={styles.fin_record_bottom} >
                <div className={styles.fin_record_box} >
                    <div>
                        <h4>Total Income</h4>
                        <MoreVert style={{fill:"white"}} />
                    </div>
                    <div>
                        <h2>$85,992</h2>
                        <div>
                            <ArrowUpward style={{fill:"#f8e5e9",fontSize:"18px"}} />
                            <h4>17%</h4>
                        </div>
                    </div>
                </div>
                <div className={styles.fin_record_box} >
                    <div>
                        <h4>Total Expense</h4>
                        <MoreVert style={{fill:"white"}} />
                    </div>
                    <div>
                        <h2>$38,160</h2>
                        <div>
                            <ArrowUpward style={{fill:"#f8e5e9",fontSize:"18px"}} />
                            <h4>44%</h4>
                        </div>
                    </div>
                </div>
                <div className={styles.fin_record_box} >
                    <div>
                        <h4>Total Saving</h4>
                        <MoreVert style={{fill:"white"}} />
                    </div>
                    <div>
                        <h2>$47,832</h2>
                        <div>
                            <ArrowUpward style={{fill:"#f8e5e9",fontSize:"18px"}} />
                            <h4>45%</h4>
                        </div>
                    </div>
                </div>
             </div>
            </div>
            <div className={styles.money_flow} >
               <div className={styles.money_flow_top} >
                  <h3>Money Flow</h3>
                  <div className={styles.graph_label} >
                    <div><Circle style={{fontSize:"13px"}} /> <h4>Total Saving</h4></div>
                    <div><Circle style={{fontSize:"13px",fill:"coral"}} /> <h4>Total Expense</h4></div>
                  </div>
                  <div className={styles.dropdown} >Weekly <ArrowDropDown/></div>
               </div>
               <div className={styles.money_flow_graph} >
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                   }}
                   >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                  </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>
            <div className={styles.money_cards} >
              <div className={styles.send_money} >
                <div className={styles.send_top} >
                  <h3>Send Money To</h3>
                  <MoreVert/>
                </div>
                <div className={styles.send_bottom} >
                  <div><Add style={{fill:"white"}} /></div>
                  <Avatar alt="Remy Sharp" src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png" />
                  <Avatar alt="Travis Howard" src="https://w7.pngwing.com/pngs/481/915/png-transparent-computer-icons-user-avatar-woman-avatar-computer-business-conversation-thumbnail.png" />
                  <Avatar alt="Cindy Baker" src="https://cdn-icons-png.flaticon.com/512/147/147133.png" />
                </div>
              </div>
              <div className={styles.send_money} >
                <div className={styles.send_top} >
                  <h3>Scheduled Payments</h3>
                  <MoreVert/>
                </div>
                <div className={styles.scheduled_cards} >
                  <div>
                    <h4>Discord</h4>
                    <h4>$34.99/m</h4>
                  </div>
                  <div>
                    <h4>Wattpad</h4>
                    <h4>$14.99/m</h4>
                  </div>
                  <div>
                    <h4>Netflix</h4>
                    <h4>9.99/m</h4>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className={styles.fin_bottom_right} >
         <div className={styles.transactions} > 
            <div className={styles.tran_top} >
              <h3>Transactions</h3>
              <div className={styles.dropdown} >Month <ArrowDropDown/></div>
            </div>
            <div className={styles.tran_cards} >
              <div className={styles.tran_card}>
                <div className={styles.tran_card_left} >
                  <div>
                    <DriveFolderUpload style={{fill:"var(--redTheme)"}} />
                  </div>
                  <div>
                    <h4>Jane Cooper</h4>
                    <h5>08 Sep, 2022</h5>
                  </div>
                </div>
                <div className={styles.tran_card_right} >
                    <AttachFile style={{fontSize:"18px"}} />
                    <h3>$1200</h3>
                </div>
              </div>
              <div className={styles.tran_card}>
                <div className={styles.tran_card_left} >
                  <div>
                    <DriveFolderUpload style={{fill:"var(--redTheme)"}} />
                  </div>
                  <div>
                    <h4>Jane Cooper</h4>
                    <h5>08 Sep, 2022</h5>
                  </div>
                </div>
                <div className={styles.tran_card_right} >
                    <AttachFile style={{fontSize:"18px"}} />
                    <h3>$1200</h3>
                </div>
              </div>
              <div className={styles.tran_card}>
                <div className={styles.tran_card_left} >
                  <div>
                    <DriveFolderUpload style={{fill:"var(--redTheme)"}} />
                  </div>
                  <div>
                    <h4>Jane Cooper</h4>
                    <h5>08 Sep, 2022</h5>
                  </div>
                </div>
                <div className={styles.tran_card_right} >
                    <AttachFile style={{fontSize:"18px"}} />
                    <h3>$1200</h3>
                </div>
              </div>
              <div className={styles.tran_card}>
                <div className={styles.tran_card_left} >
                  <div>
                    <DriveFolderUpload style={{fill:"var(--redTheme)"}} />
                  </div>
                  <div>
                    <h4>Jane Cooper</h4>
                    <h5>08 Sep, 2022</h5>
                  </div>
                </div>
                <div className={styles.tran_card_right} >
                    <AttachFile style={{fontSize:"18px"}} />
                    <h3>$1200</h3>
                </div>
              </div>
              <div className={styles.tran_card}>
                <div className={styles.tran_card_left} >
                  <div>
                    <DriveFolderUpload style={{fill:"var(--redTheme)"}} />
                  </div>
                  <div>
                    <h4>Jane Cooper</h4>
                    <h5>08 Sep, 2022</h5>
                  </div>
                </div>
                <div className={styles.tran_card_right} >
                    <AttachFile style={{fontSize:"18px"}} />
                    <h3>$1200</h3>
                </div>
              </div>
              <div className={styles.tran_card}>
                <div className={styles.tran_card_left} >
                  <div>
                    <DriveFolderUpload style={{fill:"var(--redTheme)"}} />
                  </div>
                  <div>
                    <h4>Jane Cooper</h4>
                    <h5>08 Sep, 2022</h5>
                  </div>
                </div>
                <div className={styles.tran_card_right} >
                    <AttachFile style={{fontSize:"18px"}} />
                    <h3>$1200</h3>
                </div>
              </div>
            </div>
         </div>
         <div className={styles.cred_cards} >
          
         </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default FinDash