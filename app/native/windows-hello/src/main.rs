
use std::env;
use std::ffi::c_void;

use windows::{
    core::{factory, HSTRING, Result},
    Security::Credentials::UI::{
        UserConsentVerificationResult,
        UserConsentVerifier,
    },
    Win32::{
        Foundation::HWND,
        System::WinRT::{
            IUserConsentVerifierInterop,
            RoInitialize,
            RoUninitialize,
            RO_INIT_MULTITHREADED,
        },
    },
};

use windows_future::IAsyncOperation;

struct RoGuard;

impl Drop for RoGuard {
    fn drop(&mut self) {
        unsafe {
            RoUninitialize();
        }
    }
}

fn run() -> Result<()> {
    let argument = env::args()
        .nth(1)
        .expect("Missing Electron window handle");

    let handle = u64::from_str_radix(&argument, 16)
        .expect("Invalid Electron window handle");

    assert_ne!(handle, 0, "Invalid window handle");

    unsafe {
        RoInitialize(RO_INIT_MULTITHREADED)?;
    }

    let _ro_guard = RoGuard;

    let result = unsafe {
        let interop =
            factory::<UserConsentVerifier, IUserConsentVerifierInterop>()?;

        let hwnd = HWND(handle as usize as *mut c_void);

        let message = HSTRING::from(
            "Verify your identity to access MoneyMind AI",
        );

        let operation: IAsyncOperation<UserConsentVerificationResult> =
            interop.RequestVerificationForWindowAsync(
                hwnd,
                &message,
            )?;

        operation.join()?
    };

    match result {
        UserConsentVerificationResult::Verified => {
            println!("verified");
        }
        UserConsentVerificationResult::Canceled => {
            println!("canceled");
        }
        UserConsentVerificationResult::DeviceNotPresent => {
            println!("unavailable");
        }
        UserConsentVerificationResult::NotConfiguredForUser => {
            println!("not-configured");
        }
        UserConsentVerificationResult::DisabledByPolicy => {
            println!("disabled");
        }
        UserConsentVerificationResult::RetriesExhausted => {
            println!("retries-exhausted");
        }
        UserConsentVerificationResult::DeviceBusy => {
            println!("busy");
        }
        _ => {
            println!("failed");
        }
    }

    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("Windows Hello error: {error}");
        std::process::exit(1);
    }
}
