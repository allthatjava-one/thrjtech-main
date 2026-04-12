I want to create a new feature call PDF Splitter. This feature will allow users to split a PDF document into multiple smaller documents based on specified criteria, such as page ranges or specific content. The PDF Splitter will be integrated into our existing PDF management system, providing users with an easy-to-use interface for selecting the PDF they want to split and defining the parameters for the split.

# Requirements:
- The PDF Splitter should support splitting by page ranges (e.g., pages "1,1-5", "6-10").
- The page will have split input field that takes 1,3-5,7-10 as input and splits the PDF accordingly.
- There should be output options that put all output into Single File(ONE) or Multiple Files(MULTIPLE).


# User Interface:
- The user interface will include a file upload section where users can select the PDF they want to split.
- Design principals should be similar to PDF-compressor.
- Backend endpoint will be provided in environment variables as PDF_SPLITTER_BACKEND_URL
- The new menu "PDF Splitter" should be added under PDF section in the main navigation menu.
- The end point should be /pdf-splitter and should accept POST requests with the PDF file and the split parameters.
- Once the split is complete, the user should be provided with download links for the resulting PDF files, either as individual files or as a single combined file, depending on the output option selected.

# Example from the api-gateway/api/v1/pdf-splitter
- For Multiple Output
{
    "success": true,
    "outputOption": "MULTIPLE",
    "results": [
        {
            "segment": "1",
            "url": "https://bcb399f679de349d9bc17e3055d5ecb6.r2.cloudflarestorage.com/pdf-bucket/HEO%2CHYENOK%28551-592-421%29-signed-split-1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=603ad07fb0f528f84f83e4b7b4044855%2F20260412%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260412T181355Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=8134d4a0e8759c73947fa616184f1bbe879bedc8eb7c8f44f73cde387c0244f1",
            "splitKey": "HEO,HYENOK(551-592-421)-signed-split-1.pdf"
        },
        {
            "segment": "3-5",
            "url": "https://bcb399f679de349d9bc17e3055d5ecb6.r2.cloudflarestorage.com/pdf-bucket/HEO%2CHYENOK%28551-592-421%29-signed-split-3-5.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=603ad07fb0f528f84f83e4b7b4044855%2F20260412%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260412T181355Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=485d0cd50ad559d0a7c28590952e8562f3ff63f095091f859b3a19c85f5b31be",
            "splitKey": "HEO,HYENOK(551-592-421)-signed-split-3-5.pdf"
        }
    ]
}   

- For Single Output
{
    "success": true,
    "outputOption": "ONE",
    "results": [
        {
            "segment": "combined",
            "url": "https://bcb399f679de349d9bc17e3055d5ecb6.r2.cloudflarestorage.com/pdf-bucket/HEO%2CHYENOK%28551-592-421%29-signed-split-combined.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=603ad07fb0f528f84f83e4b7b4044855%2F20260412%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260412T181432Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=40195bb4e4dc1674fb2691639ebcf72ffea92eaddf4184e22483437410852342",
            "splitKey": "HEO,HYENOK(551-592-421)-signed-split-combined.pdf"
        }
    ]
}
