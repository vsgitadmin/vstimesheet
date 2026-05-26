module.exports = ({ name, link, email, bannerUrl = '' }) => {
    return `<div style="background-color:#f1f1f1;padding:20px 10px">  
    <div style="width: 800px;;margin:0 auto;border-radius:5px"> 
                <div style="background-image: url('${bannerUrl}'); width: 100%; height: 200px; background-size: cover;" ></div>
        <div style="background-color:#fff;padding:20px;margin:0px 0 30px 0px">
            <div style="margin-top:10px">
              <h2 style="font-weight:600;font-size:20px;margin:0; font-family:'Work Sans',sans-serif;">Dear ${name},</h2>
              <div>
    
            <div>
                <p style="font-family:'Work Sans',sans-serif;" >
                    Congratulations and welcome to the Vector Shades
                    family! We are excited to have you on board. Your journey 
                    with us begins here, and we're here to support you every 
                    step of the way.
                </p>
                <p style="font-family:'Work Sans',sans-serif;" >
                    Here's a concise overview of the main app features in bullet points:
                </p>
    
                <ul style="font-family:'Work Sans',sans-serif;" >
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >Project and Task Management:</span> Collaboration and boost productivity by efficiently organizing and managing projects and tasks.</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >Timesheet: </span>Keep track of your working hours and task progress effortlessly</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >Document Sharing:</span>Seamlessly share, access, and collaborate on important documents, fostering efficient teamwork.</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >Attendance Tracking:</span>Log your attendance with ease</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >Leave Management: </span>Request and manage leaves conveniently through the app, simplifying the process for both you and your team.</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >To-Do Lists:</span> Create, prioritize, and manage tasks effectively, helping you stay organized and focused.</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >Chat Integration:</span> Communicate and collaborate in real-time with colleagues through the integrated chat feature.</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >Announcement Notices:</span> Stay informed about company updates, announcements, and important notices to stay connected.</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >Learning Management System (LMS):</span> Access a comprehensive range of training resources, courses, and materials via the integrated LMS</li>
                    <li style="padding: 3px;" ><span style="font-weight: bold;" >And More: </span>Explore additional features designed to optimize your workflow and enhance your overall work experience.</li>
                </ul>
    
                <p style="font-family:'Work Sans',sans-serif;" >Your registered email is: <span style="font-weight: bold;" >${email}</span> and default password is <span style="font-weight: bold;" >1234</span> Please use this email for all work-related correspondence.</p>
            </div>    
    
            <p style="font-family:'Work Sans',sans-serif;" > To ensure the security of your account, please establish your password by clicking on the link provided:</p>
                
            <div style="vertical-align:top;text-align:right;display:inline-block;margin-top: 20px;"> 
                  <a href="${link || 'https://vectorshades-frontend.vercel.app/auth/password/forget'}" style="background-color:#e64848;border:none;padding:8px 30px;color:#fff;font-size:16px;font-weight:500;border-radius:4px;font-family:'Work Sans',sans-serif;display:inline-block;text-decoration:none;margin-top:0px;text-align:center">SET PASSWORD</a>
            </div>
    
            <h2 style="font-weight:600;font-size:16px;margin:0; font-family:'Work Sans',sans-serif;margin-top: 20px;">Best Regards</h2>
    
            <div style="padding: 0;margin: 0;margin-top: 20px;" >
                <p style="padding: 0;margin: 0;margin-top: 5px;font-family:'Work Sans',sans-serif;color: lightgrey;" >Vector Shades LTD</p>
                <p style="padding: 0;margin: 0;margin-top: 5px;font-family:'Work Sans',sans-serif;color: lightgrey;" >Kochi, Kerala, India</p>
            </div>
    
            </div>
            </div>
        </div>
    </div>
    </div>`
}