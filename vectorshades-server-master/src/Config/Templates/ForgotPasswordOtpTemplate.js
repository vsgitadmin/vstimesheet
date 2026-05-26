module.exports = ({ name, code, bannerUrl = '' }) => {
    return `<div style="background-color:#f1f1f1;padding:20px 10px">  
<div style="width: 800px;;margin:0 auto;border-radius:5px"> 
            <div style="background-image: url('${bannerUrl}'); width: 100%; height: 200px; background-size: cover;" ></div>
    <div style="background-color:#fff;padding:20px;margin:0px 0 30px 0px">
        <div style="margin-top:10px">
          <h2 style="font-weight:600;font-size:20px;margin:0; font-family:'Work Sans',sans-serif;">Dear ${name},</h2>
          <div>

        <div>
            <p style="font-family:'Work Sans',sans-serif;" >
                You've requested a password reset for your vector shades management account. 
                Please use the following One-Time Password (OTP) to reset your password:
                Please enter this OTP on the password reset page to regain access to your account. This OTP is valid for the next 15 minutes
            </p>
            <h2 style="font-weight:600;font-size:20px;margin:0; font-family:'Work Sans',sans-serif;">OTP: ${code}</h2>
        </div>    

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