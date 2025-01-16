import React from "react";

const STRKLogo = ({ height, width }: { height: any; width: any }) => {
    return (
        <svg       width={`${height}`}
        height={`${width}`} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_7_6849)">
                <path d="M0.40509 15.9998C0.40509 24.6127 7.38698 31.5945 15.9998 31.5945C24.6127 31.5945 31.595 24.6125 31.595 15.9998C31.595 7.38697 24.6127 0.40506 15.9998 0.40506C7.38698 0.40506 0.40509 7.38695 0.40509 15.9998Z" fill="#0C0C4F" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 15.9998C0 7.16325 7.16325 0 15.9998 0C24.8364 0 32 7.16325 32 15.9998C32 24.8362 24.8364 31.9996 15.9998 31.9996C7.16325 31.9996 0 24.8364 0 15.9998ZM15.9998 0.810127C7.61067 0.810127 0.810127 7.61067 0.810127 15.9998C0.810127 24.389 7.61067 31.1895 15.9998 31.1895C24.389 31.1895 31.1899 24.3887 31.1899 15.9998C31.1899 7.6107 24.389 0.810127 15.9998 0.810127Z" fill="#EC796B" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.9426 12.2304L9.33756 11.0102C9.41784 10.762 9.61371 10.5689 9.8628 10.4927L11.089 10.1157C11.2587 10.0638 11.2601 9.82437 11.0917 9.76978L9.87107 9.37481C9.62335 9.29454 9.43022 9.09865 9.35362 8.84956L8.97699 7.62339C8.92516 7.45412 8.68571 7.45228 8.63111 7.62109L8.23615 8.84132C8.15587 9.08901 7.96 9.28215 7.7109 9.35877L6.48472 9.73537C6.315 9.78767 6.31315 10.0267 6.48196 10.0813L7.70264 10.4762C7.95036 10.5565 8.14349 10.7528 8.22009 11.0019L8.59672 12.2276C8.64854 12.3974 8.888 12.3992 8.9426 12.2304Z" fill="#FAFAFA" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M28.3236 11.5202C27.8181 10.9549 27.0293 10.6367 26.2623 10.5062C25.4892 10.3808 24.6785 10.3925 23.9153 10.528C22.371 10.7893 20.9681 11.4287 19.7444 12.2175C19.109 12.6047 18.5671 13.0526 18.0057 13.5089C17.7352 13.7396 17.4885 13.9853 17.2317 14.2275L16.5299 14.9258C15.7673 15.7229 15.0157 16.4489 14.2884 17.0507C13.5582 17.6497 12.8755 18.1047 12.2028 18.4224C11.5304 18.7417 10.811 18.9295 9.87331 18.9596C8.94385 18.9924 7.84419 18.8246 6.66793 18.5477C5.48534 18.2721 4.2435 17.8791 2.85577 17.541C3.33999 18.8843 4.06914 20.0714 5.0053 21.1567C5.95244 22.223 7.13513 23.1947 8.65446 23.8339C10.1518 24.4873 12.0336 24.7218 13.793 24.368C15.5572 24.0284 17.1053 23.2122 18.3566 22.268C19.6112 21.3142 20.6262 20.2278 21.4819 19.0983C21.7181 18.7863 21.843 18.6116 22.014 18.3677L22.4865 17.6679C22.8148 17.235 23.1137 16.7421 23.4386 16.3132C24.0757 15.4149 24.704 14.5177 25.4339 13.6911C25.8013 13.2718 26.1888 12.8708 26.6461 12.4854C26.8741 12.2973 27.1206 12.1132 27.3936 11.9473C27.6707 11.7685 27.9633 11.6285 28.3236 11.5202Z" fill="#EC796B" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M28.3236 11.5202C27.7807 10.1498 26.771 8.99635 25.4159 8.14517C24.0691 7.30332 22.1985 6.87371 20.3447 7.23993C19.429 7.41705 18.5418 7.75803 17.7632 8.2121C16.9882 8.66438 16.2936 9.20882 15.6924 9.7929C15.3922 10.0859 15.1198 10.3916 14.8491 10.699L14.1476 11.5934L13.0641 13.0332C11.6828 14.8856 10.1953 17.0565 7.75418 17.6998C5.35777 18.3313 4.3184 17.772 2.85577 17.541C3.12322 18.2314 3.45448 18.902 3.90357 19.4918C4.3443 20.0937 4.86489 20.6588 5.5121 21.1435C5.83917 21.3762 6.18448 21.6059 6.568 21.8007C6.94979 21.9889 7.3615 22.1545 7.80095 22.2791C8.67508 22.5187 9.6592 22.6027 10.612 22.4737C11.5653 22.3465 12.4765 22.0446 13.273 21.6434C14.0754 21.2458 14.7743 20.7617 15.3984 20.251C16.639 19.2207 17.604 18.0823 18.4191 16.9317C18.8291 16.3563 19.2013 15.7702 19.5455 15.1839L19.9506 14.4858C20.0745 14.2818 20.1997 14.0764 20.3269 13.8853C20.8403 13.1171 21.3424 12.5011 21.9522 12.0388C22.5535 11.5645 23.391 11.214 24.51 11.1327C25.6243 11.0503 26.9108 11.2024 28.3236 11.5202Z" fill="#FAFAFA" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2949 22.9057C22.2949 23.9123 23.1113 24.7285 24.1176 24.7285C25.1242 24.7285 25.9394 23.9123 25.9394 22.9057C25.9394 21.8994 25.1242 21.0829 24.1176 21.0829C23.1113 21.0829 22.2949 21.8994 22.2949 22.9057Z" fill="#EC796B" />
            </g>
            <defs>
                <clipPath id="clip0_7_6849">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>

    );
};

export default STRKLogo;
