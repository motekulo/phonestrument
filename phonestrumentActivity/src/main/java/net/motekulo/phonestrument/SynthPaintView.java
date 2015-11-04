package net.motekulo.phonestrument;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

public class SynthPaintView extends View {

	public interface touchListener {
		void onPositionChange(View view, float[] lineData);
	}
	private static final String APP_NAME = "Phonstrument";
	//private static final float MINP = 0.25f;
	//private static final float MAXP = 0.75f;
	private Paint	mPaint;
	private Bitmap  mBitmap;
	private Canvas  mCanvas;
	private Path    mPath;
	private Paint   mBitmapPaint;
	private net.motekulo.phonestrument.SynthPaintView.touchListener mTouchListener;
	float alpha;
	private float[] lineData; // we use this to map to the wavetable data in the synth

	public SynthPaintView(Context context) {
		super(context);
		initView();

	}

	public SynthPaintView (Context context, AttributeSet attrs) {
		super(context, attrs);
		initView();
	}

	public SynthPaintView (Context context, AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
		initView();
	}

	private void initView() {

		mPath = new Path();
		mBitmapPaint = new Paint(Paint.DITHER_FLAG);

		mPaint = new Paint();
		mPaint.setAntiAlias(true);
		mPaint.setDither(true);
		mPaint.setColor(0xFFFF0000);
		mPaint.setStyle(Paint.Style.STROKE);
		mPaint.setStrokeJoin(Paint.Join.ROUND);
		mPaint.setStrokeCap(Paint.Cap.ROUND);
		mPaint.setStrokeWidth(12);
		alpha = (float)0.7;
		lineData = new float[256];

		for (int i = 0; i < lineData.length; i ++) {
			lineData[i] = (float)0.5;
		}
	}

	public void setTouchListener(final touchListener listener) {
		mTouchListener = listener;
	}

	public float[] getLineData() {
		return lineData;
	}

	public void setLineData(float[] lineData) {
		this.lineData = lineData;
		invalidate();
	}

	public void setAlphaSmoothing(float alpha) {
		this.alpha = alpha;
		invalidate();
	}
	
	@Override
	protected void onSizeChanged(int w, int h, int oldw, int oldh) {
		super.onSizeChanged(w, h, oldw, oldh);
		mBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
		mCanvas = new Canvas(mBitmap);
		touchTolerance = this.getWidth()/lineData.length;
	}

	@Override
	protected void onDraw(Canvas canvas) {
		canvas.drawColor(0xFFAAAAAA);

		canvas.drawBitmap(mBitmap, 0, 0, mBitmapPaint);

		int width = this.getWidth();
		int height = this.getHeight();
		
		for (int i = 1; i < lineData.length; i++) {
			float smoothed;
			smoothed = lineData[i-1] + alpha * (lineData[i] - lineData[i-1]);
			lineData[i] = smoothed;
			// get x from
			float xFrom = (i-1)/(float)lineData.length * width;
			// get y from
			float yFrom = height - (height/2 + (lineData[i-1]  * height/2));
			float xTo = (i)/(float)lineData.length * width;
			// get y from
			float yTo = height - (height/2 + (lineData[i] * height/2));

			mPath.moveTo(xFrom, yFrom);
			mPath.lineTo(xTo, yTo);
		}
		
		canvas.drawPath(mPath, mPaint);
		if (mTouchListener != null) {
			mTouchListener.onPositionChange(this, lineData);
		}
		
	}

	private float mX, mY;
	private static final float TOUCH_TOLERANCE = 8;
	private float touchTolerance;

	private void touch_start(float x, float y) {
		mPath.reset();
		int width = this.getWidth();
		int height = this.getHeight();
		int index = (int) (x/(float)width * lineData.length);
		if (index >= lineData.length) {
			index = lineData.length - 1;
		}
		if (index < 0) {
			index = 0;
		}

		mX = x;
		mY = y;
		Log.i(APP_NAME, "touch start");

	}
	private void touch_move(float x, float y) {
		mPath.reset();
		int width = this.getWidth();
		int height = this.getHeight();

		int index = (int) (x/(float)width * lineData.length);
		if (index >= lineData.length) {
			index = lineData.length - 1;
		}
		if (index < 0) {
			index = 0;
		}
		// Get spot from previous point in array

		float dx = Math.abs(x - mX);
		float dy = Math.abs(y - mY);
		
		if (dx >= touchTolerance) {

			lineData[index] = (height - 2 * y)/height;  // convert back to a wavetable type graph
		
			mX = x;
			mY = y;

		}

	}
	private void touch_up() {
		
	}

	@Override
	public boolean onTouchEvent(MotionEvent event) {
		float x = event.getX();
		float y = event.getY();

		switch (event.getAction()) {
		case MotionEvent.ACTION_DOWN:
			touch_start(x, y);
			invalidate();
			break;
		case MotionEvent.ACTION_MOVE:
			touch_move(x, y);
			invalidate();
			break;
		case MotionEvent.ACTION_UP:
			touch_up();
			invalidate();
			break;
		}
		return true;
	}


}
