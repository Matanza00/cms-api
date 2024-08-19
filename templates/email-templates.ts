const PAYMENT_TEMPLATE = (text: string) => {
  return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Advance Payment Link</title>
            <style>
              .container {
                width: 100%;
                height: 100%;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .email {
                width: 80%;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
              }
              .email-header {
                background-color: #FF3636;
                color: #fff;
                padding: 10px;
                text-align: center;
              }
              .email-body {
                padding: 20px;
              }
              .email-body>p{
                font-weight:500;
                font-size:16px;
                color:#555;
              }
              .email-footer {
                background-color: #FF3636;
                color: #fff;
                padding: 15px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email">
                <div class="email-header">
                  <h1>CMS</h1>
                </div>
                <div class="email-body">
                  <p>${text}</p>
                </div>
                <div class="email-footer">
                  <p>NXC - CMS ©copyright 24</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
};

export { PAYMENT_TEMPLATE };
